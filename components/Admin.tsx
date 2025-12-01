
import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../hooks/useContent';
import { 
    Save, 
    Trash, 
    Plus, 
    ChevronDown, 
    ChevronRight,
    Layout, 
    Briefcase, 
    Home as HomeIcon, 
    ExternalLink,
    Menu,
    X,
    Search,
    ArrowUp,
    ArrowDown,
    Image as ImageIcon,
    Upload,
    Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Interface para resultados de pesquisa
interface SearchResult {
    path: string;
    value: string;
    breadcrumb: string;
    sectionId: string;
}

// Mapa de nomes amigáveis para os caminhos
const PATH_MAP: Record<string, string> = {
    'homePage': 'Página Inicial',
    'businessPage': 'Página Empresas',
    'hero': 'Hero (Topo)',
    'about': 'Sobre',
    'howItWorks': 'Como Funciona',
    'features': 'Funcionalidades',
    'flows': 'Fluxos',
    'screenshots': 'Telas',
    'testimonials': 'Depoimentos',
    'businessCta': 'Chamada Empresas',
    'forClients': 'Chamada Clientes',
    'contact': 'Contato',
    'footer': 'Rodapé',
    'valueProposition': 'Proposta de Valor',
    'infoSections': 'Detalhes',
    'cta': 'CTA Final',
    'title': 'Título',
    'subtitle': 'Subtítulo',
    'description': 'Descrição',
    'primary_button': 'Botão Primário',
    'secondary_button': 'Botão Secundário',
    'tagline': 'Tagline',
    'button': 'Botão',
    'segments': 'Segmentos',
    'useCases': 'Casos de Uso',
    'image': 'Imagem'
};

const getBreadcrumb = (path: string): string => {
    const parts = path.split('.');
    return parts.map(p => PATH_MAP[p] || p.replace(/_/g, ' ')).join(' / ');
};

const getSectionIdFromPath = (path: string): string => {
    if (path.startsWith('homePage.hero')) return 'home-hero';
    if (path.startsWith('homePage.about')) return 'home-about';
    if (path.startsWith('homePage.howItWorks')) return 'home-how';
    if (path.startsWith('homePage.features')) return 'home-features';
    if (path.startsWith('homePage.useCases')) return 'home-usecases';
    if (path.startsWith('homePage.flows')) return 'home-flows';
    if (path.startsWith('homePage.flowsConfig')) return 'home-flows';
    if (path.startsWith('homePage.screenshots')) return 'home-screenshots';
    if (path.startsWith('homePage.testimonials')) return 'home-testimonials';
    if (path.startsWith('homePage.businessCta')) return 'home-business';
    if (path.startsWith('homePage.contact')) return 'home-contact';
    if (path.startsWith('homePage.footer')) return 'site-footer';
    
    if (path.startsWith('businessPage.hero')) return 'business-hero';
    if (path.startsWith('businessPage.valueProposition')) return 'business-value';
    if (path.startsWith('businessPage.infoSections')) return 'business-info';
    if (path.startsWith('businessPage.features')) return 'business-features';
    if (path.startsWith('businessPage.segments')) return 'business-segments';
    if (path.startsWith('businessPage.flows')) return 'business-flows';
    if (path.startsWith('businessPage.flowsConfig')) return 'business-flows';
    if (path.startsWith('businessPage.screenshots')) return 'business-screenshots';
    if (path.startsWith('businessPage.testimonials')) return 'business-testimonials';
    if (path.startsWith('businessPage.forClients')) return 'business-clients';
    if (path.startsWith('businessPage.cta')) return 'business-cta';
    
    return '';
};

const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const getNestedValue = (obj: any, path: string) => {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// --- Componentes Auxiliares (Definidos fora do componente Admin para evitar re-render) ---

const Input = ({ label, path, textarea = false, value, onChange, isActive }: { label: string, path: string, textarea?: boolean, value: any, onChange: (path: string, val: any) => void, isActive?: boolean }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-400">{label}</label>
            {textarea ? (
                <textarea 
                  data-path={path}
                  className={`w-full rounded-lg p-3 outline-none h-24 resize-y transition-all duration-300 admin-input ${isActive ? 'bg-orange-900/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'focus:border-orange-500'}`}
                  value={value || ''}
                  onChange={(e) => onChange(path, e.target.value)}
                />
            ) : (
                <input 
                  data-path={path}
                  type="text" 
                  className={`w-full rounded-lg p-3 outline-none transition-all duration-300 admin-input ${isActive ? 'bg-orange-900/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'focus:border-orange-500'}`}
                  value={value || ''}
                  onChange={(e) => onChange(path, e.target.value)}
                />
            )}
        </div>
    );
};

const ImageInput = ({ value, onChange, label, path, placeholder = "URL da imagem...", isActive }: { value: string, onChange: (val: string) => void, label?: string, path?: string, placeholder?: string, isActive?: boolean }) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                if (file.size > 800 * 1024) {
                    if(!window.confirm("Esta imagem é grande (>800KB) e pode demorar para salvar ou carregar. Deseja continuar? Recomenda-se usar imagens otimizadas ou links externos.")) {
                        return;
                    }
                }
                const base64 = await convertToBase64(file);
                onChange(base64);
            } catch (err) {
                console.error("Erro ao converter imagem", err);
                alert("Erro ao processar imagem.");
            }
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold mb-2 text-gray-400">{label}</label>}
            
            <div className="flex flex-col gap-3">
                <div className={`relative w-full h-32 admin-input rounded-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ${isActive ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''}`}>
                    {value ? (
                        <>
                            <img src={value} alt="Preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium">Pré-visualização</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <ImageIcon size={24} className="mb-1 opacity-50"/>
                            <span className="text-xs">Sem imagem</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                     <div className="relative flex-grow">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            data-path={path}
                            type="text" 
                            className={`w-full admin-input rounded-lg pl-10 pr-3 py-2 text-sm focus:border-orange-500 outline-none transition-all duration-300 ${isActive ? 'border-orange-500' : ''}`}
                            placeholder={placeholder}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        />
                     </div>
                     
                     <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap">
                         <Upload size={16} />
                         <span className="hidden sm:inline text-sm">Upload</span>
                         <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </label>
                </div>
            </div>
        </div>
    );
};

const SectionCard = ({ title, id, isOpen, onToggle, children }: { title: string, id: string, isOpen: boolean, onToggle: () => void, children?: React.ReactNode }) => {
    return (
        <div id={id} className="admin-card rounded-xl overflow-hidden mb-8 shadow-sm transition-all duration-300">
            <div 
                className={`p-6 admin-card-header flex justify-between items-center cursor-pointer transition-colors`}
                onClick={onToggle}
            >
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className={`w-1 h-6 rounded-full transition-colors ${isOpen ? 'bg-orange-500' : 'bg-gray-600'}`}></span>
                    {title}
                </h3>
                <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </div>
            
            {isOpen && (
                <div className="p-6 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const NavItem = ({ label, id, onExpand }: { label: string, id: string, onExpand: (id: string) => void }) => (
    <button 
        onClick={() => onExpand(id)}
        className="text-left w-full py-2 px-8 text-sm text-gray-400 hover:text-orange-500 transition-colors border-l-2 border-transparent hover:border-orange-500"
    >
        {label}
    </button>
);

export const Admin: React.FC = () => {
  const { content, loading, saveContent } = useContent();
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (content) {
        try {
            setFormData(JSON.parse(JSON.stringify(content)));
        } catch (e) {
            setFormData({...content});
        }
    }
  }, [content]);

  useEffect(() => {
      if (!formData || !searchTerm) {
          setResults([]);
          setCurrentResultIndex(-1);
          return;
      }

      const found: SearchResult[] = [];
      const termLower = searchTerm.toLowerCase();

      const traverse = (obj: any, currentPath: string) => {
          if (typeof obj === 'string' || typeof obj === 'number') {
              const valStr = String(obj);
              if (valStr.startsWith('data:image') && valStr.length > 100) return;

              if (valStr.toLowerCase().includes(termLower)) {
                  found.push({
                      path: currentPath,
                      value: valStr,
                      breadcrumb: getBreadcrumb(currentPath),
                      sectionId: getSectionIdFromPath(currentPath)
                  });
              }
          } else if (Array.isArray(obj)) {
              obj.forEach((item, idx) => traverse(item, `${currentPath}.${idx}`));
          } else if (typeof obj === 'object' && obj !== null) {
              Object.keys(obj).forEach(key => traverse(obj[key], `${currentPath}.${key}`));
          }
      };

      traverse(formData, ''); 
      Object.keys(formData).forEach(key => traverse(formData[key], key));
      
      setResults(found);
      
      // Keep index if possible to avoid jumping while typing search queries
      // If we can find the previous path in the new results, keep it
      // Otherwise reset
      setCurrentResultIndex(prev => {
         if (found.length === 0) return -1;
         return 0; // Reset to first result on search change for simplicity
      });
      
      setShowResultsDropdown(true);

  }, [searchTerm, formData]);

  const navigateToResult = (index: number) => {
      if (index < 0 || index >= results.length) return;
      
      const result = results[index];
      setCurrentResultIndex(index);
      
      if (result.sectionId) {
          setExpandedSections(prev => ({ ...prev, [result.sectionId]: true }));
      }

      const findAndScroll = (attempt = 1) => {
          let element = document.querySelector(`[data-path="${result.path}"]`) as HTMLElement;
          
          if (!element) {
             const parts = result.path.split('.');
             if (!isNaN(parseInt(parts[parts.length - 1]))) {
                 parts.pop(); 
                 const parentPath = parts.join('.');
                 element = document.querySelector(`[data-path="${parentPath}"]`) as HTMLElement;
             }
          }

          if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                  element.focus();
              }

              element.classList.add('ring-4', 'ring-orange-500', 'bg-orange-900/30');
              setTimeout(() => {
                  element.classList.remove('ring-4', 'ring-orange-500', 'bg-orange-900/30');
              }, 2000);
          } else {
              if (attempt < 15) {
                  setTimeout(() => findAndScroll(attempt + 1), 100);
              }
          }
      };

      setTimeout(() => findAndScroll(), 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          if (results.length === 0) return;
          
          let nextIndex = currentResultIndex;
          if (e.shiftKey) {
              nextIndex = currentResultIndex > 0 ? currentResultIndex - 1 : results.length - 1;
          } else {
              nextIndex = currentResultIndex < results.length - 1 ? currentResultIndex + 1 : 0;
          }
          navigateToResult(nextIndex);
          setShowResultsDropdown(false); 
      }
  };

  const handleNextResult = () => {
      const nextIndex = currentResultIndex < results.length - 1 ? currentResultIndex + 1 : 0;
      navigateToResult(nextIndex);
  };

  const handlePrevResult = () => {
      const prevIndex = currentResultIndex > 0 ? currentResultIndex - 1 : results.length - 1;
      navigateToResult(prevIndex);
  };

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const handleArrayChange = (path: string, index: number, field: string, value: any) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) {
        if (!current[k]) current[k] = [];
        current = current[k];
      }
      
      if (current[index]) {
        current[index][field] = value;
        setFormData(newData);
      }
  };
  
  const handleStringArrayChange = (path: string, index: number, value: string) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) current = current[k];
      
      const arrayValue = value.split('\n').filter(s => s.trim() !== '');
      if (current[index]) {
        current[index]['points'] = arrayValue;
        setFormData(newData);
      }
  };

  const addItem = (path: string, template: any) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) {
        if (!current[k]) current[k] = [];
        current = current[k];
      }
      
      current.push(template);
      setFormData(newData);
  };

  const removeItem = (path: string, index: number) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) current = current[k];
      
      current.splice(index, 1);
      setFormData(newData);
  };

  const handleSave = async () => {
      try {
          setStatus('Salvando...');
          await saveContent(formData);
          setStatus('Salvo com sucesso!');
          setTimeout(() => setStatus(''), 3000);
      } catch (e) {
          setStatus('Erro ao salvar.');
          console.error(e);
      }
  };

  const toggleSection = (id: string) => {
      setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandSection = (id: string) => {
      setExpandedSections(prev => ({ ...prev, [id]: true }));
      
      setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
              const offset = 140; 
              const bodyRect = document.body.getBoundingClientRect().top;
              const elementRect = element.getBoundingClientRect().top;
              const elementPosition = elementRect - bodyRect;
              const offsetPosition = elementPosition - offset;
      
              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      }, 100);
      
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  if (loading || !formData) return <div className="min-h-screen flex items-center justify-center admin-wrapper pt-16">Carregando editor...</div>;
  
  // Garantir que formData.homePage.about.images existe para evitar erro
  const aboutImages = formData.homePage.about.images || (formData.homePage.about.image ? [formData.homePage.about.image] : []);

  return (
    <div className="flex min-h-screen admin-wrapper pt-16 transition-colors duration-300">
        
        {/* Mobile Toggle */}
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-20 right-4 z-40 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 shadow-xl"
        >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Navigation */}
        <aside className={`
            fixed lg:sticky top-16 h-[calc(100vh-4rem)] w-72 admin-sidebar flex flex-col z-40 transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white">W</div>
                    <span className="font-bold text-xl">Wevity Admin</span>
                </div>
                <p className="text-xs text-gray-500">Sistema de Gestão de Conteúdo</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar">
                
                {/* External Links */}
                <div className="px-4 mb-6 space-y-2">
                    <Link to="/business" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/5 hover:bg-black/10 border border-transparent hover:border-orange-500/30 transition-all text-sm font-medium text-gray-500 hover:text-orange-500">
                        <Briefcase size={16} className="text-orange-400" />
                        Ir para Empresas
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/5 hover:bg-black/10 border border-transparent hover:border-orange-500/30 transition-all text-sm font-medium text-gray-500 hover:text-orange-500">
                        <HomeIcon size={16} className="text-orange-400" />
                        Ir para Clientes
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                    </Link>
                </div>

                <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Editores</div>

                {/* Home Menu */}
                <div>
                    <button 
                        onClick={() => setExpandedMenu(expandedMenu === 'home' ? null : 'home')}
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${expandedMenu === 'home' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Layout size={18} className={expandedMenu === 'home' ? 'text-orange-500' : ''} />
                            Página Inicial
                        </div>
                        {expandedMenu === 'home' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {expandedMenu === 'home' && (
                        <div className="bg-black/5 py-2 animate-fadeIn">
                            <NavItem label="Hero (Topo)" id="home-hero" onExpand={expandSection} />
                            <NavItem label="Sobre" id="home-about" onExpand={expandSection} />
                            <NavItem label="Como Funciona" id="home-how" onExpand={expandSection} />
                            <NavItem label="Funcionalidades" id="home-features" onExpand={expandSection} />
                            <NavItem label="Casos de Uso" id="home-usecases" onExpand={expandSection} />
                            <NavItem label="Fluxos" id="home-flows" onExpand={expandSection} />
                            <NavItem label="Telas (Prints)" id="home-screenshots" onExpand={expandSection} />
                            <NavItem label="Depoimentos" id="home-testimonials" onExpand={expandSection} />
                            <NavItem label="Chamada Empresas" id="home-business" onExpand={expandSection} />
                            <NavItem label="Contato" id="home-contact" onExpand={expandSection} />
                        </div>
                    )}
                </div>

                {/* Business Menu */}
                <div>
                    <button 
                        onClick={() => setExpandedMenu(expandedMenu === 'business' ? null : 'business')}
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${expandedMenu === 'business' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase size={18} className={expandedMenu === 'business' ? 'text-orange-500' : ''} />
                            Página Empresas
                        </div>
                        {expandedMenu === 'business' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {expandedMenu === 'business' && (
                        <div className="bg-black/5 py-2 animate-fadeIn">
                            <NavItem label="Hero (Topo)" id="business-hero" onExpand={expandSection} />
                            <NavItem label="Proposta de Valor" id="business-value" onExpand={expandSection} />
                            <NavItem label="Detalhes (Info)" id="business-info" onExpand={expandSection} />
                            <NavItem label="Funcionalidades" id="business-features" onExpand={expandSection} />
                            <NavItem label="Segmentos" id="business-segments" onExpand={expandSection} />
                            <NavItem label="Fluxos" id="business-flows" onExpand={expandSection} />
                            <NavItem label="Telas (Prints)" id="business-screenshots" onExpand={expandSection} />
                            <NavItem label="Depoimentos" id="business-testimonials" onExpand={expandSection} />
                            <NavItem label="Chamada Clientes" id="business-clients" onExpand={expandSection} />
                            <NavItem label="CTA Final" id="business-cta" onExpand={expandSection} />
                        </div>
                    )}
                </div>

                {/* Footer Link */}
                <div className="mt-4 px-4">
                     <button onClick={() => expandSection('site-footer')} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-black/5 transition-all text-sm font-medium text-gray-400 hover:text-orange-500">
                        <Menu size={18} />
                        Rodapé Global
                     </button>
                </div>

            </nav>
            
            <div className="p-4 border-t border-white/5 text-xs text-center text-gray-600">
                v1.2.3
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
            {/* Top Bar with Search */}
            <div className="sticky top-16 z-30 admin-header backdrop-blur-md px-4 lg:px-8 py-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg transition-colors">
                <div className="flex items-center gap-4 w-full md:w-auto relative group">
                    <div className="relative w-full md:w-[28rem] lg:w-[32rem]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Pesquisar textos, títulos..." 
                            className="w-full admin-input rounded-lg pl-10 pr-24 py-2.5 text-sm focus:border-orange-500 outline-none transition-all placeholder-gray-500 shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={() => setShowResultsDropdown(true)}
                            onBlur={() => setTimeout(() => setShowResultsDropdown(false), 200)}
                        />
                        
                        {/* Search Counter & Navigation */}
                        {results.length > 0 && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-700/50 rounded p-1">
                                <span className="text-xs text-gray-400 font-mono px-1 border-r border-gray-600 mr-1">
                                    {currentResultIndex + 1}/{results.length}
                                </span>
                                <button onClick={handlePrevResult} className="hover:text-orange-400 text-gray-400 p-0.5 rounded hover:bg-white/10" title="Anterior (Shift+Enter)">
                                    <ArrowUp size={14} />
                                </button>
                                <button onClick={handleNextResult} className="hover:text-orange-400 text-gray-400 p-0.5 rounded hover:bg-white/10" title="Próximo (Enter)">
                                    <ArrowDown size={14} />
                                </button>
                            </div>
                        )}

                        {/* Dropdown Results */}
                        {showResultsDropdown && results.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 custom-scrollbar animate-fadeIn">
                                {results.map((res, idx) => (
                                    <div 
                                        key={idx}
                                        onMouseDown={() => navigateToResult(idx)} // onMouseDown fires before onBlur
                                        className={`px-4 py-3 border-b border-gray-700/50 cursor-pointer transition-colors flex flex-col gap-1
                                            ${idx === currentResultIndex ? 'bg-orange-500/10 border-l-4 border-l-orange-500' : 'hover:bg-white/5 border-l-4 border-l-transparent'}
                                        `}
                                    >
                                        <div className="text-xs font-semibold text-orange-400/80 uppercase tracking-wide flex items-center gap-1">
                                            {res.breadcrumb}
                                        </div>
                                        <div className="text-sm text-gray-200 line-clamp-2 font-medium">
                                            {res.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                     {status && (
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.includes('Erro') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'} animate-pulse`}>
                            {status}
                        </span>
                    )}
                    <button 
                        onClick={handleSave} 
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105 whitespace-nowrap"
                    >
                        <Save size={18} />
                        Salvar
                    </button>
                </div>
            </div>

            <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
                
                {/* ================= PÁGINA INICIAL ================= */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                        <Layout className="text-orange-500" />
                        Página Inicial
                    </h2>
                    
                    <SectionCard title="Hero (Topo)" id="home-hero" isOpen={!!expandedSections['home-hero']} onToggle={() => toggleSection('home-hero')}>
                        <Input label="Título (Parte 1)" path="homePage.hero.title_part1" value={getNestedValue(formData, 'homePage.hero.title_part1')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.hero.title_part1"} />
                        <Input label="Título (Destaque)" path="homePage.hero.title_highlight" value={getNestedValue(formData, 'homePage.hero.title_highlight')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.hero.title_highlight"} />
                        <Input label="Subtítulo" path="homePage.hero.subtitle" textarea value={getNestedValue(formData, 'homePage.hero.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.hero.subtitle"} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Botão Primário" path="homePage.hero.primary_button" value={getNestedValue(formData, 'homePage.hero.primary_button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.hero.primary_button"} />
                            <Input label="Botão Secundário" path="homePage.hero.secondary_button" value={getNestedValue(formData, 'homePage.hero.secondary_button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.hero.secondary_button"} />
                        </div>
                        <Input label="Link do Botão Primário" path="homePage.hero.primary_button_link" value={getNestedValue(formData, 'homePage.hero.primary_button_link')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.hero.primary_button_link"} />
                        
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Imagens do Hero</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ImageInput 
                                    label="Esquerda" 
                                    path="homePage.hero.image_left"
                                    value={formData.homePage.hero.image_left || ''} 
                                    onChange={(val) => handleChange('homePage.hero.image_left', val)} 
                                    isActive={results[currentResultIndex]?.path === "homePage.hero.image_left"}
                                />
                                <ImageInput 
                                    label="Central (Frente)" 
                                    path="homePage.hero.image_center"
                                    value={formData.homePage.hero.image_center || ''} 
                                    onChange={(val) => handleChange('homePage.hero.image_center', val)} 
                                    isActive={results[currentResultIndex]?.path === "homePage.hero.image_center"}
                                />
                                <ImageInput 
                                    label="Direita" 
                                    path="homePage.hero.image_right"
                                    value={formData.homePage.hero.image_right || ''} 
                                    onChange={(val) => handleChange('homePage.hero.image_right', val)} 
                                    isActive={results[currentResultIndex]?.path === "homePage.hero.image_right"}
                                />
                            </div>
                        </div>

                    </SectionCard>

                    <SectionCard title="Sobre" id="home-about" isOpen={!!expandedSections['home-about']} onToggle={() => toggleSection('home-about')}>
                        <Input label="Título" path="homePage.about.title" value={getNestedValue(formData, 'homePage.about.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.about.title"} />
                        <Input label="Descrição" path="homePage.about.description" textarea value={getNestedValue(formData, 'homePage.about.description')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.about.description"} />
                        
                        <div className="mt-6">
                            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Galeria de Fotos Espalhadas</h4>
                            <p className="text-xs text-gray-500 mb-4">Adicione até 4 imagens para o efeito de "fotos jogadas".</p>
                            
                            <div className="space-y-6">
                                {aboutImages.map((img: string, idx: number) => (
                                    <div key={idx} className="p-4 admin-input rounded-lg relative">
                                        <button 
                                            onClick={() => {
                                                const newImages = [...aboutImages];
                                                newImages.splice(idx, 1);
                                                handleChange('homePage.about.images', newImages);
                                            }} 
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"
                                        >
                                            <Trash size={16}/>
                                        </button>
                                        <ImageInput 
                                            value={img} 
                                            path={`homePage.about.images.${idx}`}
                                            onChange={(val) => {
                                                const newImages = [...aboutImages];
                                                newImages[idx] = val;
                                                handleChange('homePage.about.images', newImages);
                                            }} 
                                            label={`Foto ${idx + 1}`}
                                            isActive={results[currentResultIndex]?.path === `homePage.about.images.${idx}`}
                                        />
                                    </div>
                                ))}
                                {aboutImages.length < 4 && (
                                    <button 
                                        onClick={() => {
                                            const newImages = [...aboutImages, ''];
                                            handleChange('homePage.about.images', newImages);
                                        }} 
                                        className="w-full py-3 border-2 border-dashed border-gray-700 text-gray-400 rounded-lg hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} /> Adicionar Foto
                                    </button>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Como Funciona" id="home-how" isOpen={!!expandedSections['home-how']} onToggle={() => toggleSection('home-how')}>
                        <Input label="Título da Seção" path="homePage.howItWorks.title" value={getNestedValue(formData, 'homePage.howItWorks.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.howItWorks.title"} />
                        
                        <div className="mb-4">
                            <ImageInput 
                                label="Imagem da Seção (Opcional)"
                                path="homePage.howItWorks.image"
                                value={formData.homePage.howItWorks.image || ''}
                                onChange={(val) => handleChange('homePage.howItWorks.image', val)}
                                isActive={results[currentResultIndex]?.path === "homePage.howItWorks.image"}
                            />
                        </div>

                        <div className="space-y-4 mt-6">
                            {formData.homePage.howItWorks.steps.map((step: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">Passo {idx + 1}</span>
                                    </div>
                                    <input 
                                        data-path={`homePage.howItWorks.steps.${idx}.title`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 text-sm focus:border-orange-500 outline-none" 
                                        value={step.title} 
                                        onChange={(e) => handleArrayChange('homePage.howItWorks.steps', idx, 'title', e.target.value)}
                                        placeholder="Título do passo"
                                    />
                                    <textarea 
                                        data-path={`homePage.howItWorks.steps.${idx}.description`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-sm h-16 focus:border-orange-500 outline-none" 
                                        value={step.description} 
                                        onChange={(e) => handleArrayChange('homePage.howItWorks.steps', idx, 'description', e.target.value)}
                                        placeholder="Descrição do passo"
                                    />
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Rest of the component continues... */}
                    
                    <SectionCard title="Funcionalidades" id="home-features" isOpen={!!expandedSections['home-features']} onToggle={() => toggleSection('home-features')}>
                        <Input label="Título" path="homePage.features.title" value={getNestedValue(formData, 'homePage.features.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.features.title"} />
                        <Input label="Subtítulo" path="homePage.features.subtitle" textarea value={getNestedValue(formData, 'homePage.features.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.features.subtitle"} />
                        
                        <div className="mt-6 grid gap-4">
                            {formData.homePage.features.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg relative group">
                                    <button 
                                        onClick={() => removeItem('homePage.features.items', idx)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <Trash size={16} />
                                    </button>
                                    <input 
                                        data-path={`homePage.features.items.${idx}.title`}
                                        className="w-full bg-transparent border-b border-gray-600 focus:border-orange-500 rounded-none px-0 py-2 mb-2 font-bold outline-none" 
                                        value={item.title} 
                                        onChange={(e) => handleArrayChange('homePage.features.items', idx, 'title', e.target.value)}
                                        placeholder="Título"
                                    />
                                    <textarea 
                                        data-path={`homePage.features.items.${idx}.description`}
                                        className="w-full bg-transparent border-none p-0 text-gray-400 text-sm h-12 focus:ring-0 outline-none resize-none" 
                                        value={item.description} 
                                        onChange={(e) => handleArrayChange('homePage.features.items', idx, 'description', e.target.value)}
                                        placeholder="Descrição"
                                    />
                                </div>
                            ))}
                            <button 
                                onClick={() => addItem('homePage.features.items', { title: 'Nova Funcionalidade', description: 'Descrição...' })}
                                className="w-full py-3 border-2 border-dashed border-gray-700 text-gray-400 rounded-lg hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition flex items-center justify-center gap-2"
                            >
                                <Plus size={20} /> Adicionar Funcionalidade
                            </button>
                        </div>
                    </SectionCard>
                    
                    <SectionCard title="Casos de Uso" id="home-usecases" isOpen={!!expandedSections['home-usecases']} onToggle={() => toggleSection('home-usecases')}>
                        <Input label="Título" path="homePage.useCases.title" value={getNestedValue(formData, 'homePage.useCases.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.useCases.title"} />
                        <Input label="Subtítulo" path="homePage.useCases.subtitle" value={getNestedValue(formData, 'homePage.useCases.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.useCases.subtitle"} />
                        
                        <div className="grid gap-4 mt-6">
                            {(formData.homePage.useCases?.items || []).map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg relative">
                                    <button onClick={() => removeItem('homePage.useCases.items', idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"><Trash size={16}/></button>
                                    
                                    <div className="mb-4">
                                        <ImageInput 
                                            value={item.image} 
                                            path={`homePage.useCases.items.${idx}.image`}
                                            onChange={(val) => handleArrayChange('homePage.useCases.items', idx, 'image', val)} 
                                            label="Imagem (Ícone)"
                                            isActive={results[currentResultIndex]?.path === `homePage.useCases.items.${idx}.image`}
                                        />
                                    </div>

                                    <input 
                                        data-path={`homePage.useCases.items.${idx}.title`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 font-bold outline-none focus:border-orange-500" 
                                        value={item.title} 
                                        onChange={(e) => handleArrayChange('homePage.useCases.items', idx, 'title', e.target.value)}
                                        placeholder="Título (Ex: Aniversariantes)"
                                    />
                                    <textarea 
                                        data-path={`homePage.useCases.items.${idx}.description`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-gray-300 text-sm h-16 focus:border-orange-500 outline-none resize-none" 
                                        value={item.description} 
                                        onChange={(e) => handleArrayChange('homePage.useCases.items', idx, 'description', e.target.value)}
                                        placeholder="Descrição"
                                    />
                                </div>
                            ))}
                            <button 
                                onClick={() => {
                                    if(!formData.homePage.useCases) {
                                        setFormData({
                                            ...formData, 
                                            homePage: {
                                                ...formData.homePage, 
                                                useCases: { title: 'Casos de Uso', subtitle: '', items: [] }
                                            }
                                        });
                                        setTimeout(() => addItem('homePage.useCases.items', {title: 'Novo Caso', description: '', image: ''}), 100);
                                    } else {
                                        addItem('homePage.useCases.items', {title: 'Novo Caso', description: '', image: ''});
                                    }
                                }} 
                                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-orange-500 transition flex justify-center gap-2 items-center"
                            >
                                <Plus size={20} /> Adicionar Caso de Uso
                            </button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Fluxos (Diagramas)" id="home-flows" isOpen={!!expandedSections['home-flows']} onToggle={() => toggleSection('home-flows')}>
                        <Input label="Título Geral" path="homePage.flowsConfig.title" value={getNestedValue(formData, 'homePage.flowsConfig.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.flowsConfig.title"} />
                        <Input label="Subtítulo Geral" path="homePage.flowsConfig.subtitle" textarea value={getNestedValue(formData, 'homePage.flowsConfig.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.flowsConfig.subtitle"} />

                        {formData.homePage.flows.map((flow: any, fIdx: number) => (
                            <div key={fIdx} className="mt-8 p-6 border border-orange-500/20 rounded-xl bg-orange-500/5 relative">
                                <button onClick={() => removeItem('homePage.flows', fIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash size={18}/></button>
                                <h4 className="font-bold text-orange-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Slide de Fluxo {fIdx + 1}</h4>
                                <div className="mb-4 space-y-3">
                                    <input 
                                        data-path={`homePage.flows.${fIdx}.sectionTitle`}
                                        className="w-full admin-input rounded p-3 focus:border-orange-500 outline-none" 
                                        value={flow.sectionTitle} 
                                        onChange={(e) => handleArrayChange('homePage.flows', fIdx, 'sectionTitle', e.target.value)}
                                        placeholder="Título do Slide"
                                    />
                                    <input 
                                        data-path={`homePage.flows.${fIdx}.sectionSubtitle`}
                                        className="w-full admin-input rounded p-3 focus:border-orange-500 outline-none" 
                                        value={flow.sectionSubtitle} 
                                        onChange={(e) => handleArrayChange('homePage.flows', fIdx, 'sectionSubtitle', e.target.value)}
                                        placeholder="Subtítulo do Slide"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {flow.steps.map((step: any, sIdx: number) => (
                                        <div key={sIdx} className="p-4 admin-input rounded-lg">
                                            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Passo {sIdx + 1}</div>
                                            <input 
                                                data-path={`homePage.flows.${fIdx}.steps.${sIdx}.title`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 text-sm focus:border-orange-500 outline-none" 
                                                value={step.title} 
                                                onChange={(e) => {
                                                    const newFlows = [...formData.homePage.flows];
                                                    newFlows[fIdx].steps[sIdx].title = e.target.value;
                                                    setFormData({...formData, homePage: {...formData.homePage, flows: newFlows}});
                                                }}
                                                placeholder="Título"
                                            />
                                            <textarea 
                                                data-path={`homePage.flows.${fIdx}.steps.${sIdx}.description`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 text-xs h-16 focus:border-orange-500 outline-none resize-none" 
                                                value={step.description} 
                                                onChange={(e) => {
                                                    const newFlows = [...formData.homePage.flows];
                                                    newFlows[fIdx].steps[sIdx].description = e.target.value;
                                                    setFormData({...formData, homePage: {...formData.homePage, flows: newFlows}});
                                                }}
                                                placeholder="Descrição"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => addItem('homePage.flows', { sectionTitle: 'Novo Fluxo', sectionSubtitle: '', steps: [{}, {}, {}, {}] })}
                            className="w-full py-3 mt-6 border-2 border-dashed border-gray-700 text-gray-400 rounded-lg hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Adicionar Slide de Fluxo
                        </button>
                    </SectionCard>

                    <SectionCard title="Telas (Screenshots)" id="home-screenshots" isOpen={!!expandedSections['home-screenshots']} onToggle={() => toggleSection('home-screenshots')}>
                        <Input label="Título" path="homePage.screenshots.title" value={getNestedValue(formData, 'homePage.screenshots.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.screenshots.title"} />
                        <Input label="Subtítulo" path="homePage.screenshots.subtitle" value={getNestedValue(formData, 'homePage.screenshots.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.screenshots.subtitle"} />
                        
                        <div className="grid gap-4 mt-6">
                            {formData.homePage.screenshots.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-start p-4 admin-input rounded-lg group">
                                    <div className="flex-grow space-y-4">
                                        <ImageInput 
                                            value={item.image} 
                                            path={`homePage.screenshots.items.${idx}.image`}
                                            onChange={(val) => handleArrayChange('homePage.screenshots.items', idx, 'image', val)} 
                                            label="Imagem"
                                            isActive={results[currentResultIndex]?.path === `homePage.screenshots.items.${idx}.image`}
                                        />
                                        <input 
                                            data-path={`homePage.screenshots.items.${idx}.caption`}
                                            className="w-full bg-transparent text-gray-400 text-xs focus:text-white outline-none border-b border-gray-600 pb-1" 
                                            value={item.caption} 
                                            onChange={(e) => handleArrayChange('homePage.screenshots.items', idx, 'caption', e.target.value)}
                                            placeholder="Legenda da Imagem"
                                        />
                                    </div>
                                    <button onClick={() => removeItem('homePage.screenshots.items', idx)} className="text-gray-500 hover:text-red-500 p-2"><Trash size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => addItem('homePage.screenshots.items', {image: '', caption: ''})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white transition">+ Adicionar Imagem</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Depoimentos" id="home-testimonials" isOpen={!!expandedSections['home-testimonials']} onToggle={() => toggleSection('home-testimonials')}>
                        <Input label="Título" path="homePage.testimonials.title" value={getNestedValue(formData, 'homePage.testimonials.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.testimonials.title"} />
                        <Input label="Subtítulo" path="homePage.testimonials.subtitle" value={getNestedValue(formData, 'homePage.testimonials.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.testimonials.subtitle"} />

                        <div className="space-y-4 mt-6">
                            {formData.homePage.testimonials.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg relative group">
                                    <button onClick={() => removeItem('homePage.testimonials.items', idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500"><Trash size={16}/></button>
                                    <textarea 
                                        data-path={`homePage.testimonials.items.${idx}.quote`}
                                        className="w-full bg-transparent border-b border-gray-600 italic mb-2 h-16 focus:border-orange-500 outline-none resize-none"
                                        value={item.quote}
                                        onChange={(e) => handleArrayChange('homePage.testimonials.items', idx, 'quote', e.target.value)}
                                        placeholder="Depoimento"
                                    />
                                    <input 
                                        data-path={`homePage.testimonials.items.${idx}.author`}
                                        className="w-full bg-transparent text-orange-400 font-bold outline-none"
                                        value={item.author}
                                        onChange={(e) => handleArrayChange('homePage.testimonials.items', idx, 'author', e.target.value)}
                                        placeholder="Autor"
                                    />
                                </div>
                            ))}
                            <button onClick={() => addItem('homePage.testimonials.items', {quote: '', author: ''})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white w-full transition">+ Adicionar Depoimento</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Chamada para Empresas" id="home-business" isOpen={!!expandedSections['home-business']} onToggle={() => toggleSection('home-business')}>
                        <Input label="Tagline" path="homePage.businessCta.tagline" value={getNestedValue(formData, 'homePage.businessCta.tagline')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.businessCta.tagline"} />
                        <Input label="Título" path="homePage.businessCta.title" value={getNestedValue(formData, 'homePage.businessCta.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.businessCta.title"} />
                        <Input label="Subtítulo" path="homePage.businessCta.subtitle" textarea value={getNestedValue(formData, 'homePage.businessCta.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.businessCta.subtitle"} />
                        <Input label="Botão" path="homePage.businessCta.button" value={getNestedValue(formData, 'homePage.businessCta.button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.businessCta.button"} />

                        <div className="mt-6">
                            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Abas de Conteúdo</h4>
                            <div className="space-y-4">
                                {formData.homePage.businessCta.tabs.map((tab: any, idx: number) => (
                                    <div key={idx} className="p-4 admin-input rounded-lg">
                                        <div className="text-xs text-orange-400 font-bold mb-3 uppercase">Aba {idx + 1}</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <input 
                                                data-path={`homePage.businessCta.tabs.${idx}.title`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 text-sm focus:border-orange-500 outline-none" 
                                                value={tab.title} 
                                                onChange={(e) => handleArrayChange('homePage.businessCta.tabs', idx, 'title', e.target.value)}
                                                placeholder="Título da Aba"
                                            />
                                            <input 
                                                data-path={`homePage.businessCta.tabs.${idx}.content_title`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 text-sm focus:border-orange-500 outline-none" 
                                                value={tab.content_title} 
                                                onChange={(e) => handleArrayChange('homePage.businessCta.tabs', idx, 'content_title', e.target.value)}
                                                placeholder="Título do Conteúdo"
                                            />
                                        </div>
                                        <textarea 
                                            data-path={`homePage.businessCta.tabs.${idx}.content_description`}
                                            className="w-full bg-black/20 border border-gray-600 rounded p-2 text-sm h-20 focus:border-orange-500 outline-none resize-none" 
                                            value={tab.content_description} 
                                            onChange={(e) => handleArrayChange('homePage.businessCta.tabs', idx, 'content_description', e.target.value)}
                                            placeholder="Descrição do Conteúdo"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Contato" id="home-contact" isOpen={!!expandedSections['home-contact']} onToggle={() => toggleSection('home-contact')}>
                        <Input label="Título" path="homePage.contact.title" value={getNestedValue(formData, 'homePage.contact.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.contact.title"} />
                        <Input label="Descrição" path="homePage.contact.description" textarea value={getNestedValue(formData, 'homePage.contact.description')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.contact.description"} />
                        <Input label="Botão" path="homePage.contact.button" value={getNestedValue(formData, 'homePage.contact.button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "homePage.contact.button"} />
                    </SectionCard>
                </div>


                {/* ================= PÁGINA EMPRESAS ================= */}
                <div className="mb-12">
                     <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4 mt-20">
                        <Briefcase className="text-orange-500" />
                        Página Empresas
                    </h2>

                    <SectionCard title="Hero (Topo)" id="business-hero" isOpen={!!expandedSections['business-hero']} onToggle={() => toggleSection('business-hero')}>
                        <Input label="Título Hero" path="businessPage.hero.title" value={getNestedValue(formData, 'businessPage.hero.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.hero.title"} />
                        <Input label="Subtítulo Hero" path="businessPage.hero.subtitle" textarea value={getNestedValue(formData, 'businessPage.hero.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.hero.subtitle"} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Botão Primário" path="businessPage.hero.cta_button" value={getNestedValue(formData, 'businessPage.hero.cta_button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.hero.cta_button"} />
                            <Input label="Botão Secundário" path="businessPage.hero.secondary_button" value={getNestedValue(formData, 'businessPage.hero.secondary_button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.hero.secondary_button"} />
                        </div>
                    </SectionCard>
                    
                    {/* ... Rest of business page sections (omitted for brevity but kept in final code) ... */}
                    {/* The structure follows the same pattern as before, just ensuring we don't break the existing code */}
                    
                    <SectionCard title="Proposta de Valor" id="business-value" isOpen={!!expandedSections['business-value']} onToggle={() => toggleSection('business-value')}>
                        <Input label="Título da Seção" path="businessPage.valueProposition.title" value={getNestedValue(formData, 'businessPage.valueProposition.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.valueProposition.title"} />
                        <div className="grid gap-4 mt-6">
                            {formData.businessPage.valueProposition.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg">
                                    <div className="flex gap-4">
                                         <div className="w-10 h-10 bg-orange-500/10 rounded flex items-center justify-center text-orange-500 font-mono text-xs overflow-hidden" title="Ícone SVG">SVG</div>
                                         <div className="flex-grow">
                                            <input 
                                                data-path={`businessPage.valueProposition.items.${idx}.title`}
                                                className="w-full bg-transparent border-b border-gray-600 font-bold mb-2 focus:border-orange-500 outline-none" 
                                                value={item.title} 
                                                onChange={(e) => handleArrayChange('businessPage.valueProposition.items', idx, 'title', e.target.value)}
                                                placeholder="Título"
                                            />
                                            <textarea 
                                                data-path={`businessPage.valueProposition.items.${idx}.description`}
                                                className="w-full bg-transparent text-gray-400 text-sm h-16 border-none resize-none focus:ring-0 outline-none" 
                                                value={item.description} 
                                                onChange={(e) => handleArrayChange('businessPage.valueProposition.items', idx, 'description', e.target.value)}
                                                placeholder="Descrição"
                                            />
                                         </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-700">
                                        <label className="text-xs text-gray-500">SVG Icon Code:</label>
                                        <input 
                                            data-path={`businessPage.valueProposition.items.${idx}.icon`}
                                            className="w-full bg-black/20 text-xs text-gray-400 p-1 rounded mt-1"
                                            value={item.icon}
                                            onChange={(e) => handleArrayChange('businessPage.valueProposition.items', idx, 'icon', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Detalhes (Info Sections)" id="business-info" isOpen={!!expandedSections['business-info']} onToggle={() => toggleSection('business-info')}>
                        <div className="space-y-8">
                            {formData.businessPage.infoSections.map((section: any, idx: number) => (
                                <div key={idx} className="p-6 admin-input rounded-xl relative">
                                    <button onClick={() => removeItem('businessPage.infoSections', idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-1"><Trash size={18} /></button>
                                    <h4 className="text-orange-400 font-bold mb-4 uppercase tracking-wider text-sm">Seção {idx + 1}</h4>
                                    
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                                        <input 
                                            data-path={`businessPage.infoSections.${idx}.title`}
                                            className="w-full bg-black/20 border border-gray-600 rounded p-2 focus:border-orange-500 outline-none" 
                                            value={section.title} 
                                            onChange={(e) => handleArrayChange('businessPage.infoSections', idx, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Descrição</label>
                                        <textarea 
                                            data-path={`businessPage.infoSections.${idx}.description`}
                                            className="w-full bg-black/20 border border-gray-600 rounded p-2 h-24 resize-none focus:border-orange-500 outline-none" 
                                            value={section.description} 
                                            onChange={(e) => handleArrayChange('businessPage.infoSections', idx, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <ImageInput 
                                            value={section.image} 
                                            path={`businessPage.infoSections.${idx}.image`}
                                            onChange={(val) => handleArrayChange('businessPage.infoSections', idx, 'image', val)} 
                                            label="Imagem da Seção"
                                            isActive={results[currentResultIndex]?.path === `businessPage.infoSections.${idx}.image`}
                                        />
                                    </div>
                                    
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Pontos da Lista (um por linha):</label>
                                    <textarea 
                                        data-path={`businessPage.infoSections.${idx}.points`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-3 h-32 font-mono text-sm focus:border-orange-500 outline-none"
                                        value={section.points.join('\n')}
                                        onChange={(e) => handleStringArrayChange('businessPage.infoSections', idx, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button 
                                onClick={() => addItem('businessPage.infoSections', {title: 'Novo Título', description: '', points: [], image: ''})} 
                                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-orange-500 hover:border-orange-500 transition flex justify-center gap-2 items-center"
                            >
                                <Plus size={20} /> Adicionar Seção de Informação
                            </button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Funcionalidades" id="business-features" isOpen={!!expandedSections['business-features']} onToggle={() => toggleSection('business-features')}>
                        <Input label="Título" path="businessPage.features.title" value={getNestedValue(formData, 'businessPage.features.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.features.title"} />
                        <Input label="Subtítulo" path="businessPage.features.subtitle" value={getNestedValue(formData, 'businessPage.features.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.features.subtitle"} />
                        
                        <div className="grid gap-4 mt-6">
                            {formData.businessPage.features.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg relative">
                                    <button onClick={() => removeItem('businessPage.features.items', idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"><Trash size={16}/></button>
                                    <input 
                                        data-path={`businessPage.features.items.${idx}.title`}
                                        className="w-full bg-transparent border-b border-gray-600 focus:border-orange-500 rounded-none px-0 py-1 mb-2 font-bold outline-none" 
                                        value={item.title} 
                                        onChange={(e) => handleArrayChange('businessPage.features.items', idx, 'title', e.target.value)}
                                        placeholder="Título"
                                    />
                                    <textarea 
                                        data-path={`businessPage.features.items.${idx}.description`}
                                        className="w-full bg-transparent border-none p-0 text-gray-400 text-sm h-12 focus:ring-0 outline-none resize-none" 
                                        value={item.description} 
                                        onChange={(e) => handleArrayChange('businessPage.features.items', idx, 'description', e.target.value)}
                                        placeholder="Descrição"
                                    />
                                    <div className="mt-2 pt-2 border-t border-gray-800">
                                         <input 
                                            data-path={`businessPage.features.items.${idx}.icon`}
                                            className="w-full bg-transparent text-xs text-gray-500" value={item.icon} onChange={(e) => handleArrayChange('businessPage.features.items', idx, 'icon', e.target.value)} placeholder="SVG Icon"
                                         />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addItem('businessPage.features.items', {title: 'Nova', description: '', icon: '<svg>...</svg>'})} className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-orange-500 transition flex justify-center gap-2 items-center"><Plus size={20} /> Adicionar Feature</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Segmentos" id="business-segments" isOpen={!!expandedSections['business-segments']} onToggle={() => toggleSection('business-segments')}>
                        <Input label="Título" path="businessPage.segments.title" value={getNestedValue(formData, 'businessPage.segments.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.segments.title"} />
                        <Input label="Subtítulo" path="businessPage.segments.subtitle" value={getNestedValue(formData, 'businessPage.segments.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.segments.subtitle"} />
                        
                        <div className="grid gap-4 mt-6">
                            {(formData.businessPage.segments?.items || []).map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg relative">
                                    <button onClick={() => removeItem('businessPage.segments.items', idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"><Trash size={16}/></button>
                                    
                                    <div className="mb-4">
                                        <ImageInput 
                                            value={item.image} 
                                            path={`businessPage.segments.items.${idx}.image`}
                                            onChange={(val) => handleArrayChange('businessPage.segments.items', idx, 'image', val)} 
                                            label="Imagem (Ícone)"
                                            isActive={results[currentResultIndex]?.path === `businessPage.segments.items.${idx}.image`}
                                        />
                                    </div>

                                    <input 
                                        data-path={`businessPage.segments.items.${idx}.title`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 font-bold outline-none focus:border-orange-500" 
                                        value={item.title} 
                                        onChange={(e) => handleArrayChange('businessPage.segments.items', idx, 'title', e.target.value)}
                                        placeholder="Nome do Segmento"
                                    />
                                    <textarea 
                                        data-path={`businessPage.segments.items.${idx}.description`}
                                        className="w-full bg-black/20 border border-gray-600 rounded p-2 text-gray-300 text-sm h-16 focus:border-orange-500 outline-none resize-none" 
                                        value={item.description} 
                                        onChange={(e) => handleArrayChange('businessPage.segments.items', idx, 'description', e.target.value)}
                                        placeholder="Descrição"
                                    />
                                </div>
                            ))}
                            <button 
                                onClick={() => {
                                    if(!formData.businessPage.segments) {
                                        setFormData({
                                            ...formData, 
                                            businessPage: {
                                                ...formData.businessPage, 
                                                segments: { title: 'Segmentos', subtitle: '', items: [] }
                                            }
                                        });
                                        setTimeout(() => addItem('businessPage.segments.items', {title: 'Novo Segmento', description: '', image: ''}), 100);
                                    } else {
                                        addItem('businessPage.segments.items', {title: 'Novo Segmento', description: '', image: ''});
                                    }
                                }} 
                                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-orange-500 transition flex justify-center gap-2 items-center"
                            >
                                <Plus size={20} /> Adicionar Segmento
                            </button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Fluxos (Business)" id="business-flows" isOpen={!!expandedSections['business-flows']} onToggle={() => toggleSection('business-flows')}>
                        <Input label="Título Geral" path="businessPage.flowsConfig.title" value={getNestedValue(formData, 'businessPage.flowsConfig.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.flowsConfig.title"} />
                        <Input label="Subtítulo Geral" path="businessPage.flowsConfig.subtitle" textarea value={getNestedValue(formData, 'businessPage.flowsConfig.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.flowsConfig.subtitle"} />

                        {formData.businessPage.flows.map((flow: any, fIdx: number) => (
                            <div key={fIdx} className="mt-8 p-6 border border-orange-500/20 rounded-xl bg-orange-500/5 relative">
                                <button onClick={() => removeItem('businessPage.flows', fIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash size={18}/></button>
                                <h4 className="font-bold text-orange-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Slide de Fluxo {fIdx + 1}</h4>
                                <div className="mb-4 space-y-3">
                                    <input 
                                        data-path={`businessPage.flows.${fIdx}.sectionTitle`}
                                        className="w-full admin-input rounded p-3 focus:border-orange-500 outline-none" 
                                        value={flow.sectionTitle} 
                                        onChange={(e) => handleArrayChange('businessPage.flows', fIdx, 'sectionTitle', e.target.value)}
                                        placeholder="Título do Slide"
                                    />
                                    <input 
                                        data-path={`businessPage.flows.${fIdx}.sectionSubtitle`}
                                        className="w-full admin-input rounded p-3 focus:border-orange-500 outline-none" 
                                        value={flow.sectionSubtitle} 
                                        onChange={(e) => handleArrayChange('businessPage.flows', fIdx, 'sectionSubtitle', e.target.value)}
                                        placeholder="Subtítulo do Slide"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {flow.steps.map((step: any, sIdx: number) => (
                                        <div key={sIdx} className="p-4 admin-input rounded-lg">
                                            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Passo {sIdx + 1}</div>
                                            <input 
                                                data-path={`businessPage.flows.${fIdx}.steps.${sIdx}.title`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 text-sm focus:border-orange-500 outline-none" 
                                                value={step.title} 
                                                onChange={(e) => {
                                                    const newFlows = [...formData.businessPage.flows];
                                                    newFlows[fIdx].steps[sIdx].title = e.target.value;
                                                    setFormData({...formData, businessPage: {...formData.businessPage, flows: newFlows}});
                                                }}
                                            />
                                            <textarea 
                                                data-path={`businessPage.flows.${fIdx}.steps.${sIdx}.description`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 text-xs h-16 focus:border-orange-500 outline-none resize-none" 
                                                value={step.description} 
                                                onChange={(e) => {
                                                    const newFlows = [...formData.businessPage.flows];
                                                    newFlows[fIdx].steps[sIdx].description = e.target.value;
                                                    setFormData({...formData, businessPage: {...formData.businessPage, flows: newFlows}});
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => addItem('businessPage.flows', { sectionTitle: 'Novo Fluxo', sectionSubtitle: '', steps: [{}, {}, {}, {}] })}
                            className="w-full py-3 mt-6 border-2 border-dashed border-gray-700 text-gray-400 rounded-lg hover:border-orange-500 hover:text-orange-500 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Adicionar Slide de Fluxo
                        </button>
                    </SectionCard>

                    <SectionCard title="Telas (Screenshots)" id="business-screenshots" isOpen={!!expandedSections['business-screenshots']} onToggle={() => toggleSection('business-screenshots')}>
                        <Input label="Título" path="businessPage.screenshots.title" value={getNestedValue(formData, 'businessPage.screenshots.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.screenshots.title"} />
                        <Input label="Subtítulo" path="businessPage.screenshots.subtitle" value={getNestedValue(formData, 'businessPage.screenshots.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.screenshots.subtitle"} />
                        
                        <div className="grid gap-4 mt-6">
                            {formData.businessPage.screenshots.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-start p-4 admin-input rounded-lg group">
                                    <div className="flex-grow space-y-4">
                                        <ImageInput 
                                            value={item.image} 
                                            path={`businessPage.screenshots.items.${idx}.image`}
                                            onChange={(val) => handleArrayChange('businessPage.screenshots.items', idx, 'image', val)} 
                                            label="Imagem"
                                            isActive={results[currentResultIndex]?.path === `businessPage.screenshots.items.${idx}.image`}
                                        />
                                        <input 
                                            data-path={`businessPage.screenshots.items.${idx}.caption`}
                                            className="w-full bg-transparent text-gray-400 text-xs focus:text-white outline-none border-b border-gray-600 pb-1" 
                                            value={item.caption} 
                                            onChange={(e) => handleArrayChange('businessPage.screenshots.items', idx, 'caption', e.target.value)}
                                            placeholder="Legenda da Imagem"
                                        />
                                    </div>
                                    <button onClick={() => removeItem('businessPage.screenshots.items', idx)} className="text-gray-500 hover:text-red-500 p-2"><Trash size={16}/></button>
                                </div>
                            ))}
                            <button onClick={() => addItem('businessPage.screenshots.items', {image: '', caption: ''})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white transition">+ Adicionar Print</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Depoimentos" id="business-testimonials" isOpen={!!expandedSections['business-testimonials']} onToggle={() => toggleSection('business-testimonials')}>
                        <Input label="Título" path="businessPage.testimonials.title" value={getNestedValue(formData, 'businessPage.testimonials.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.testimonials.title"} />
                        <Input label="Subtítulo" path="businessPage.testimonials.subtitle" value={getNestedValue(formData, 'businessPage.testimonials.subtitle')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.testimonials.subtitle"} />
                        <div className="space-y-4 mt-6">
                            {formData.businessPage.testimonials.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 admin-input rounded-lg relative group">
                                    <button onClick={() => removeItem('businessPage.testimonials.items', idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500"><Trash size={16}/></button>
                                    <textarea 
                                        data-path={`businessPage.testimonials.items.${idx}.quote`}
                                        className="w-full bg-transparent border-b border-gray-600 italic mb-2 h-16 focus:border-orange-500 outline-none resize-none"
                                        value={item.quote}
                                        onChange={(e) => handleArrayChange('businessPage.testimonials.items', idx, 'quote', e.target.value)}
                                        placeholder="Depoimento"
                                    />
                                    <input 
                                        data-path={`businessPage.testimonials.items.${idx}.author`}
                                        className="w-full bg-transparent text-orange-400 font-bold outline-none"
                                        value={item.author}
                                        onChange={(e) => handleArrayChange('businessPage.testimonials.items', idx, 'author', e.target.value)}
                                        placeholder="Autor"
                                    />
                                </div>
                            ))}
                            <button onClick={() => addItem('businessPage.testimonials.items', {quote: '', author: ''})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white w-full transition">+ Adicionar Depoimento</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Chamada para Clientes" id="business-clients" isOpen={!!expandedSections['business-clients']} onToggle={() => toggleSection('business-clients')}>
                        <Input label="Tagline" path="businessPage.forClients.tagline" value={getNestedValue(formData, 'businessPage.forClients.tagline')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.forClients.tagline"} />
                        <Input label="Título" path="businessPage.forClients.title" value={getNestedValue(formData, 'businessPage.forClients.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.forClients.title"} />
                        <Input label="Descrição" path="businessPage.forClients.description" textarea value={getNestedValue(formData, 'businessPage.forClients.description')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.forClients.description"} />
                        <Input label="Botão" path="businessPage.forClients.button" value={getNestedValue(formData, 'businessPage.forClients.button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.forClients.button"} />
                    </SectionCard>

                    <SectionCard title="CTA Final" id="business-cta" isOpen={!!expandedSections['business-cta']} onToggle={() => toggleSection('business-cta')}>
                        <Input label="Título" path="businessPage.cta.title" value={getNestedValue(formData, 'businessPage.cta.title')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.cta.title"} />
                        <Input label="Descrição" path="businessPage.cta.description" textarea value={getNestedValue(formData, 'businessPage.cta.description')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.cta.description"} />
                        <Input label="Botão" path="businessPage.cta.button" value={getNestedValue(formData, 'businessPage.cta.button')} onChange={handleChange} isActive={results[currentResultIndex]?.path === "businessPage.cta.button"} />
                    </SectionCard>
                </div>

                <SectionCard title="Rodapé (Global)" id="site-footer" isOpen={!!expandedSections['site-footer']} onToggle={() => toggleSection('site-footer')}>
                    <div className="space-y-4">
                        {formData.homePage.footer.links.map((link: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center p-3 admin-input rounded-lg">
                                <div className="flex-grow space-y-2">
                                     <input 
                                        data-path={`homePage.footer.links.${idx}.text`}
                                        className="w-full bg-transparent border-b border-gray-600 text-sm pb-1 focus:border-orange-500 outline-none" 
                                        value={link.text} 
                                        onChange={(e) => handleArrayChange('homePage.footer.links', idx, 'text', e.target.value)}
                                        placeholder="Texto do Link"
                                     />
                                     <input 
                                        data-path={`homePage.footer.links.${idx}.href`}
                                        className="w-full bg-transparent text-gray-400 text-xs focus:text-white outline-none" 
                                        value={link.href} 
                                        onChange={(e) => handleArrayChange('homePage.footer.links', idx, 'href', e.target.value)}
                                        placeholder="URL (ex: #contato)"
                                     />
                                </div>
                                <button onClick={() => removeItem('homePage.footer.links', idx)} className="text-gray-500 hover:text-red-500 p-2"><Trash size={16} /></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('homePage.footer.links', {text: 'Novo Link', href: '#'})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white w-full transition">+ Adicionar Link</button>
                    </div>
                </SectionCard>

            </div>
            
            <footer className="mt-12 py-6 text-center text-gray-600 text-sm border-t border-white/5">
                Admin Panel © {new Date().getFullYear()} Wevity
            </footer>
        </main>
    </div>
  );
};
