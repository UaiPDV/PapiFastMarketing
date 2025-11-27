import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../hooks/useContent';
import { 
    Save, 
    Trash, 
    Plus, 
    ChevronDown, 
    ChevronRight,
    ChevronUp, 
    Layout, 
    Briefcase, 
    Home as HomeIcon, 
    ExternalLink,
    Menu,
    X,
    Search,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { resolveAssetPath } from '../utils/media';

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
    'button': 'Botão'
};

const getBreadcrumb = (path: string): string => {
    const parts = path.split('.');
    return parts.map(p => PATH_MAP[p] || p.replace(/_/g, ' ')).join(' / ');
};

const getPreviewSrc = (path?: string) => resolveAssetPath(path) || path || '';

// Mapeia IDs de seção baseados no path
const getSectionIdFromPath = (path: string): string => {
    // HomePage
    if (path.startsWith('homePage.hero')) return 'home-hero';
    if (path.startsWith('homePage.about')) return 'home-about';
    if (path.startsWith('homePage.howItWorks')) return 'home-how';
    if (path.startsWith('homePage.features')) return 'home-features';
    if (path.startsWith('homePage.flows')) return 'home-flows';
    if (path.startsWith('homePage.flowsConfig')) return 'home-flows';
    if (path.startsWith('homePage.screenshots')) return 'home-screenshots';
    if (path.startsWith('homePage.testimonials')) return 'home-testimonials';
    if (path.startsWith('homePage.businessCta')) return 'home-business';
    if (path.startsWith('homePage.contact')) return 'home-contact';
    if (path.startsWith('homePage.footer')) return 'site-footer';
    
    // BusinessPage
    if (path.startsWith('businessPage.hero')) return 'business-hero';
    if (path.startsWith('businessPage.valueProposition')) return 'business-value';
    if (path.startsWith('businessPage.infoSections')) return 'business-info';
    if (path.startsWith('businessPage.features')) return 'business-features';
    if (path.startsWith('businessPage.flows')) return 'business-flows';
    if (path.startsWith('businessPage.flowsConfig')) return 'business-flows';
    if (path.startsWith('businessPage.screenshots')) return 'business-screenshots';
    if (path.startsWith('businessPage.testimonials')) return 'business-testimonials';
    if (path.startsWith('businessPage.forClients')) return 'business-clients';
    if (path.startsWith('businessPage.cta')) return 'business-cta';
    
    return '';
};

export const Admin: React.FC = () => {
  const { content, loading, saveContent } = useContent();
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Collapse State
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (content) {
        setFormData(JSON.parse(JSON.stringify(content)));
    }
  }, [content]);

  // Lógica de Pesquisa
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

      traverse(formData, ''); // Start traversal without prefix if structure matches useContent defaults
      // Ajuste: O formData tem 'homePage' e 'businessPage' na raiz? Sim.
      // Traverse keys:
      Object.keys(formData).forEach(key => traverse(formData[key], key));
      
      setResults(found);
      setCurrentResultIndex(found.length > 0 ? 0 : -1);
      setShowResultsDropdown(true);

  }, [searchTerm, formData]);

  const navigateToResult = (index: number) => {
      if (index < 0 || index >= results.length) return;
      
      const result = results[index];
      setCurrentResultIndex(index);
      
      // 1. Expand Section
      if (result.sectionId) {
          setExpandedSections(prev => ({ ...prev, [result.sectionId]: true }));
      }

      // 2. Scroll and Focus with Retry Strategy
      const findAndScroll = (attempt = 1) => {
          // Attempt exact match
          let element = document.querySelector(`[data-path="${result.path}"]`) as HTMLElement;
          
          // Fallback: If searching inside an array of strings (like points), 
          // the traverse logic gives path.index, but the input might be the parent (points)
          if (!element) {
             const parts = result.path.split('.');
             // Check if last part is number
             if (!isNaN(parseInt(parts[parts.length - 1]))) {
                 parts.pop(); // Remove index
                 const parentPath = parts.join('.');
                 element = document.querySelector(`[data-path="${parentPath}"]`) as HTMLElement;
             }
          }

          if (element) {
              // Scroll element into center view
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Focus
              if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                  element.focus();
              }

              // Highlight Animation
              element.classList.add('ring-4', 'ring-orange-500', 'bg-orange-900/30');
              setTimeout(() => {
                  element.classList.remove('ring-4', 'ring-orange-500', 'bg-orange-900/30');
              }, 2000);
          } else {
              // If not found, retry a few times (React might still be rendering)
              if (attempt < 15) {
                  setTimeout(() => findAndScroll(attempt + 1), 100);
              } else {
                  console.warn("Element not found for path after retries:", result.path);
              }
          }
      };

      // Start search immediately, but give a tiny buffer for state update to trigger render
      setTimeout(() => findAndScroll(), 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          if (results.length === 0) return;
          
          let nextIndex = currentResultIndex;
          if (e.shiftKey) {
              // Previous
              nextIndex = currentResultIndex > 0 ? currentResultIndex - 1 : results.length - 1;
          } else {
              // Next
              nextIndex = currentResultIndex < results.length - 1 ? currentResultIndex + 1 : 0;
          }
          navigateToResult(nextIndex);
          setShowResultsDropdown(false); // Hide dropdown when navigating via Enter
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
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const handleArrayChange = (path: string, index: number, field: string, value: any) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) current = current[k];
      
      current[index][field] = value;
      setFormData(newData);
  };
  
  const handleStringArrayChange = (path: string, index: number, value: string) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) current = current[k];
      
      const arrayValue = value.split('\n').filter(s => s.trim() !== '');
      current[index]['points'] = arrayValue;
      setFormData(newData);
  };

  const addItem = (path: string, template: any) => {
      const keys = path.split('.');
      const newData = { ...formData };
      let current = newData;
      for (let k of keys) current = current[k];
      
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
              const offset = 140; // Increased offset to account for search bar
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

  if (loading || !formData) return <div className="min-h-screen flex items-center justify-center bg-[#0f0f11] text-white pt-16">Carregando editor...</div>;

  const Input = ({ label, path, textarea = false }: { label: string, path: string, textarea?: boolean }) => {
      const keys = path.split('.');
      let value = formData;
      for (const k of keys) value = value?.[k];
      
      // Check if this input is the current active search result
      const isActive = results[currentResultIndex]?.path === path;
      
      return (
          <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-400">{label}</label>
              {textarea ? (
                  <textarea 
                    data-path={path}
                    className={`w-full border rounded-lg p-3 outline-none text-white h-24 resize-y transition-all duration-300 ${isActive ? 'bg-orange-900/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-gray-900/50 border-gray-700 focus:border-orange-500 focus:bg-gray-900'}`}
                    value={value || ''}
                    onChange={(e) => handleChange(path, e.target.value)}
                  />
              ) : (
                  <input 
                    data-path={path}
                    type="text" 
                    className={`w-full border rounded-lg p-3 outline-none text-white transition-all duration-300 ${isActive ? 'bg-orange-900/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-gray-900/50 border-gray-700 focus:border-orange-500 focus:bg-gray-900'}`}
                    value={value || ''}
                    onChange={(e) => handleChange(path, e.target.value)}
                  />
              )}
          </div>
      );
  };

  const SectionCard = ({ title, id, children }: { title: string, id: string, children?: React.ReactNode }) => {
      // Por padrão fechado (false), a menos que explicitamente aberto
      const isOpen = !!expandedSections[id];

      return (
          <div id={id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden mb-8 shadow-sm transition-all duration-300">
              <div 
                  className={`p-6 border-b border-gray-700/50 bg-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-750 transition-colors ${isOpen ? 'bg-gray-800' : 'bg-gray-800/50'}`}
                  onClick={() => toggleSection(id)}
              >
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
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

  const NavItem = ({ label, id }: { label: string, id: string }) => (
    <button 
        onClick={() => expandSection(id)}
        className="text-left w-full py-2 px-8 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-orange-500"
    >
        {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#0f0f11] text-white pt-16">
        
        {/* Mobile Toggle */}
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-20 right-4 z-40 p-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
        >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Navigation */}
        <aside className={`
            fixed lg:sticky top-16 h-[calc(100vh-4rem)] w-72 bg-[#161618] border-r border-white/5 flex flex-col z-40 transition-transform duration-300
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
                    <Link to="/business" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-orange-500/30 transition-all text-sm font-medium">
                        <Briefcase size={16} className="text-orange-400" />
                        Ir para Empresas
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-orange-500/30 transition-all text-sm font-medium">
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
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${expandedMenu === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Layout size={18} className={expandedMenu === 'home' ? 'text-orange-500' : ''} />
                            Página Inicial
                        </div>
                        {expandedMenu === 'home' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {expandedMenu === 'home' && (
                        <div className="bg-black/20 py-2 animate-fadeIn">
                            <NavItem label="Hero (Topo)" id="home-hero" />
                            <NavItem label="Sobre" id="home-about" />
                            <NavItem label="Como Funciona" id="home-how" />
                            <NavItem label="Funcionalidades" id="home-features" />
                            <NavItem label="Fluxos" id="home-flows" />
                            <NavItem label="Telas (Prints)" id="home-screenshots" />
                            <NavItem label="Depoimentos" id="home-testimonials" />
                            <NavItem label="Chamada Empresas" id="home-business" />
                            <NavItem label="Contato" id="home-contact" />
                        </div>
                    )}
                </div>

                {/* Business Menu */}
                <div>
                    <button 
                        onClick={() => setExpandedMenu(expandedMenu === 'business' ? null : 'business')}
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${expandedMenu === 'business' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase size={18} className={expandedMenu === 'business' ? 'text-orange-500' : ''} />
                            Página Empresas
                        </div>
                        {expandedMenu === 'business' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {expandedMenu === 'business' && (
                        <div className="bg-black/20 py-2 animate-fadeIn">
                            <NavItem label="Hero (Topo)" id="business-hero" />
                            <NavItem label="Proposta de Valor" id="business-value" />
                            <NavItem label="Detalhes (Info)" id="business-info" />
                            <NavItem label="Funcionalidades" id="business-features" />
                            <NavItem label="Fluxos" id="business-flows" />
                            <NavItem label="Telas (Prints)" id="business-screenshots" />
                            <NavItem label="Depoimentos" id="business-testimonials" />
                            <NavItem label="Chamada Clientes" id="business-clients" />
                            <NavItem label="CTA Final" id="business-cta" />
                        </div>
                    )}
                </div>

                {/* Footer Link */}
                <div className="mt-4 px-4">
                     <button onClick={() => expandSection('site-footer')} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-gray-400 hover:text-white">
                        <Menu size={18} />
                        Rodapé Global
                     </button>
                </div>

            </nav>
            
            <div className="p-4 border-t border-white/5 text-xs text-center text-gray-600">
                v1.2.0
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
            {/* Top Bar with Search */}
            <div className="sticky top-16 z-30 bg-[#0f0f11]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
                <div className="flex items-center gap-4 w-full md:w-auto relative group">
                    <div className="relative w-full md:w-[28rem] lg:w-[32rem]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Pesquisar textos, títulos..." 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-24 py-2.5 text-sm focus:border-orange-500 outline-none transition-all focus:bg-gray-750 placeholder-gray-500 shadow-inner"
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
                        {showResultsDropdown && searchTerm && results.length === 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-4 text-center text-gray-400 text-sm z-50">
                                Nenhum resultado encontrado.
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
                    
                    <SectionCard title="Hero (Topo)" id="home-hero">
                        <Input label="Título (Parte 1)" path="homePage.hero.title_part1" />
                        <Input label="Título (Destaque)" path="homePage.hero.title_highlight" />
                        <Input label="Subtítulo" path="homePage.hero.subtitle" textarea />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Botão Primário" path="homePage.hero.primary_button" />
                            <Input label="Botão Secundário" path="homePage.hero.secondary_button" />
                        </div>
                    </SectionCard>

                    <SectionCard title="Sobre" id="home-about">
                        <Input label="Título" path="homePage.about.title" />
                        <Input label="Descrição" path="homePage.about.description" textarea />
                    </SectionCard>

                    <SectionCard title="Como Funciona" id="home-how">
                        <Input label="Título da Seção" path="homePage.howItWorks.title" />
                        <div className="space-y-4 mt-6">
                            {formData.homePage.howItWorks.steps.map((step: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">Passo {idx + 1}</span>
                                    </div>
                                    <input 
                                        data-path={`homePage.howItWorks.steps.${idx}.title`}
                                        className="w-full bg-black/20 border border-gray-700 rounded p-2 mb-2 text-white text-sm focus:border-orange-500 outline-none" 
                                        value={step.title} 
                                        onChange={(e) => handleArrayChange('homePage.howItWorks.steps', idx, 'title', e.target.value)}
                                        placeholder="Título do passo"
                                    />
                                    <textarea 
                                        data-path={`homePage.howItWorks.steps.${idx}.description`}
                                        className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white text-sm h-16 focus:border-orange-500 outline-none" 
                                        value={step.description} 
                                        onChange={(e) => handleArrayChange('homePage.howItWorks.steps', idx, 'description', e.target.value)}
                                        placeholder="Descrição do passo"
                                    />
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Funcionalidades" id="home-features">
                        <Input label="Título" path="homePage.features.title" />
                        <Input label="Subtítulo" path="homePage.features.subtitle" textarea />
                        
                        <div className="mt-6 grid gap-4">
                            {formData.homePage.features.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700 relative group">
                                    <button 
                                        onClick={() => removeItem('homePage.features.items', idx)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <Trash size={16} />
                                    </button>
                                    <input 
                                        data-path={`homePage.features.items.${idx}.title`}
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-orange-500 rounded-none px-0 py-2 mb-2 text-white font-bold outline-none" 
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

                    <SectionCard title="Fluxos (Diagramas)" id="home-flows">
                        <Input label="Título Geral" path="homePage.flowsConfig.title" />
                        <Input label="Subtítulo Geral" path="homePage.flowsConfig.subtitle" textarea />

                        {formData.homePage.flows.map((flow: any, fIdx: number) => (
                            <div key={fIdx} className="mt-8 p-6 border border-orange-500/20 rounded-xl bg-orange-500/5 relative">
                                <button onClick={() => removeItem('homePage.flows', fIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash size={18}/></button>
                                <h4 className="font-bold text-orange-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Slide de Fluxo {fIdx + 1}</h4>
                                <div className="mb-4 space-y-3">
                                    <input 
                                        data-path={`homePage.flows.${fIdx}.sectionTitle`}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-orange-500 outline-none" 
                                        value={flow.sectionTitle} 
                                        onChange={(e) => handleArrayChange('homePage.flows', fIdx, 'sectionTitle', e.target.value)}
                                        placeholder="Título do Slide"
                                    />
                                    <input 
                                        data-path={`homePage.flows.${fIdx}.sectionSubtitle`}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-orange-500 outline-none" 
                                        value={flow.sectionSubtitle} 
                                        onChange={(e) => handleArrayChange('homePage.flows', fIdx, 'sectionSubtitle', e.target.value)}
                                        placeholder="Subtítulo do Slide"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {flow.steps.map((step: any, sIdx: number) => (
                                        <div key={sIdx} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Passo {sIdx + 1}</div>
                                            <input 
                                                data-path={`homePage.flows.${fIdx}.steps.${sIdx}.title`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 text-white text-sm focus:border-orange-500 outline-none" 
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
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white text-xs h-16 focus:border-orange-500 outline-none resize-none" 
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

                    <SectionCard title="Telas (Screenshots)" id="home-screenshots">
                        <Input label="Título" path="homePage.screenshots.title" />
                        <Input label="Subtítulo" path="homePage.screenshots.subtitle" />
                        
                        <div className="grid gap-4 mt-6">
                            {formData.homePage.screenshots.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center p-3 bg-gray-900 rounded-lg border border-gray-700 group">
                                     <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                         <img src={getPreviewSrc(item.image)} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <input 
                                            data-path={`homePage.screenshots.items.${idx}.image`}
                                            className="w-full bg-transparent border-b border-gray-700 text-white text-sm pb-1 focus:border-orange-500 outline-none" 
                                            value={item.image} 
                                            onChange={(e) => handleArrayChange('homePage.screenshots.items', idx, 'image', e.target.value)}
                                            placeholder="URL da Imagem"
                                        />
                                        <input 
                                            data-path={`homePage.screenshots.items.${idx}.caption`}
                                            className="w-full bg-transparent text-gray-400 text-xs focus:text-white outline-none" 
                                            value={item.caption} 
                                            onChange={(e) => handleArrayChange('homePage.screenshots.items', idx, 'caption', e.target.value)}
                                            placeholder="Legenda"
                                        />
                                    </div>
                                    <button onClick={() => removeItem('homePage.screenshots.items', idx)} className="text-gray-500 hover:text-red-500 p-2"><Trash size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => addItem('homePage.screenshots.items', {image: '', caption: ''})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white transition">+ Adicionar Imagem</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Depoimentos" id="home-testimonials">
                        <Input label="Título" path="homePage.testimonials.title" />
                        <Input label="Subtítulo" path="homePage.testimonials.subtitle" />

                        <div className="space-y-4 mt-6">
                            {formData.homePage.testimonials.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700 relative group">
                                    <button onClick={() => removeItem('homePage.testimonials.items', idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500"><Trash size={16}/></button>
                                    <textarea 
                                        data-path={`homePage.testimonials.items.${idx}.quote`}
                                        className="w-full bg-transparent border-b border-gray-700 text-white italic mb-2 h-16 focus:border-orange-500 outline-none resize-none"
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

                    <SectionCard title="Chamada para Empresas" id="home-business">
                        <Input label="Tagline" path="homePage.businessCta.tagline" />
                        <Input label="Título" path="homePage.businessCta.title" />
                        <Input label="Subtítulo" path="homePage.businessCta.subtitle" textarea />
                        <Input label="Botão" path="homePage.businessCta.button" />

                        <div className="mt-6">
                            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Abas de Conteúdo</h4>
                            <div className="space-y-4">
                                {formData.homePage.businessCta.tabs.map((tab: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                        <div className="text-xs text-orange-400 font-bold mb-3 uppercase">Aba {idx + 1}</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <input 
                                                data-path={`homePage.businessCta.tabs.${idx}.title`}
                                                className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white text-sm focus:border-orange-500 outline-none" 
                                                value={tab.title} 
                                                onChange={(e) => handleArrayChange('homePage.businessCta.tabs', idx, 'title', e.target.value)}
                                                placeholder="Título da Aba"
                                            />
                                            <input 
                                                data-path={`homePage.businessCta.tabs.${idx}.content_title`}
                                                className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white text-sm focus:border-orange-500 outline-none" 
                                                value={tab.content_title} 
                                                onChange={(e) => handleArrayChange('homePage.businessCta.tabs', idx, 'content_title', e.target.value)}
                                                placeholder="Título do Conteúdo"
                                            />
                                        </div>
                                        <textarea 
                                            data-path={`homePage.businessCta.tabs.${idx}.content_description`}
                                            className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white text-sm h-20 focus:border-orange-500 outline-none resize-none" 
                                            value={tab.content_description} 
                                            onChange={(e) => handleArrayChange('homePage.businessCta.tabs', idx, 'content_description', e.target.value)}
                                            placeholder="Descrição do Conteúdo"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Contato" id="home-contact">
                        <Input label="Título" path="homePage.contact.title" />
                        <Input label="Descrição" path="homePage.contact.description" textarea />
                        <Input label="Botão" path="homePage.contact.button" />
                    </SectionCard>
                </div>


                {/* ================= PÁGINA EMPRESAS ================= */}
                <div className="mb-12">
                     <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4 mt-20">
                        <Briefcase className="text-orange-500" />
                        Página Empresas
                    </h2>

                    <SectionCard title="Hero (Topo)" id="business-hero">
                        <Input label="Título Hero" path="businessPage.hero.title" />
                        <Input label="Subtítulo Hero" path="businessPage.hero.subtitle" textarea />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Botão Primário" path="businessPage.hero.cta_button" />
                            <Input label="Botão Secundário" path="businessPage.hero.secondary_button" />
                        </div>
                    </SectionCard>

                    <SectionCard title="Proposta de Valor" id="business-value">
                        <Input label="Título da Seção" path="businessPage.valueProposition.title" />
                        <div className="grid gap-4 mt-6">
                            {formData.businessPage.valueProposition.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                    <div className="flex gap-4">
                                         <div className="w-10 h-10 bg-orange-500/10 rounded flex items-center justify-center text-orange-500 font-mono text-xs overflow-hidden" title="Ícone SVG">SVG</div>
                                         <div className="flex-grow">
                                            <input 
                                                data-path={`businessPage.valueProposition.items.${idx}.title`}
                                                className="w-full bg-transparent border-b border-gray-700 text-white font-bold mb-2 focus:border-orange-500 outline-none" 
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

                    <SectionCard title="Detalhes (Info Sections)" id="business-info">
                        <div className="space-y-8">
                            {formData.businessPage.infoSections.map((section: any, idx: number) => (
                                <div key={idx} className="p-6 bg-gray-900 rounded-xl border border-gray-700 relative">
                                    <button onClick={() => removeItem('businessPage.infoSections', idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-1"><Trash size={18} /></button>
                                    <h4 className="text-orange-400 font-bold mb-4 uppercase tracking-wider text-sm">Seção {idx + 1}</h4>
                                    
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                                        <input 
                                            data-path={`businessPage.infoSections.${idx}.title`}
                                            className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white focus:border-orange-500 outline-none" 
                                            value={section.title} 
                                            onChange={(e) => handleArrayChange('businessPage.infoSections', idx, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Descrição</label>
                                        <textarea 
                                            data-path={`businessPage.infoSections.${idx}.description`}
                                            className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white h-24 resize-none focus:border-orange-500 outline-none" 
                                            value={section.description} 
                                            onChange={(e) => handleArrayChange('businessPage.infoSections', idx, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">URL Imagem</label>
                                        <input 
                                            data-path={`businessPage.infoSections.${idx}.image`}
                                            className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white text-sm focus:border-orange-500 outline-none" 
                                            value={section.image} 
                                            onChange={(e) => handleArrayChange('businessPage.infoSections', idx, 'image', e.target.value)}
                                        />
                                    </div>
                                    
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Pontos da Lista (um por linha):</label>
                                    <textarea 
                                        data-path={`businessPage.infoSections.${idx}.points`}
                                        className="w-full bg-black/20 border border-gray-700 rounded p-3 text-white h-32 font-mono text-sm focus:border-orange-500 outline-none"
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

                    <SectionCard title="Funcionalidades" id="business-features">
                        <Input label="Título" path="businessPage.features.title" />
                        <Input label="Subtítulo" path="businessPage.features.subtitle" />
                        
                        <div className="grid gap-4 mt-6">
                            {formData.businessPage.features.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700 relative">
                                    <button onClick={() => removeItem('businessPage.features.items', idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"><Trash size={16}/></button>
                                    <input 
                                        data-path={`businessPage.features.items.${idx}.title`}
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-orange-500 rounded-none px-0 py-1 mb-2 text-white font-bold outline-none" 
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

                    <SectionCard title="Fluxos (Business)" id="business-flows">
                        <Input label="Título Geral" path="businessPage.flowsConfig.title" />
                        <Input label="Subtítulo Geral" path="businessPage.flowsConfig.subtitle" textarea />

                        {formData.businessPage.flows.map((flow: any, fIdx: number) => (
                            <div key={fIdx} className="mt-8 p-6 border border-orange-500/20 rounded-xl bg-orange-500/5 relative">
                                <button onClick={() => removeItem('businessPage.flows', fIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash size={18}/></button>
                                <h4 className="font-bold text-orange-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Slide de Fluxo {fIdx + 1}</h4>
                                <div className="mb-4 space-y-3">
                                    <input 
                                        data-path={`businessPage.flows.${fIdx}.sectionTitle`}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-orange-500 outline-none" 
                                        value={flow.sectionTitle} 
                                        onChange={(e) => handleArrayChange('businessPage.flows', fIdx, 'sectionTitle', e.target.value)}
                                        placeholder="Título do Slide"
                                    />
                                    <input 
                                        data-path={`businessPage.flows.${fIdx}.sectionSubtitle`}
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-orange-500 outline-none" 
                                        value={flow.sectionSubtitle} 
                                        onChange={(e) => handleArrayChange('businessPage.flows', fIdx, 'sectionSubtitle', e.target.value)}
                                        placeholder="Subtítulo do Slide"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {flow.steps.map((step: any, sIdx: number) => (
                                        <div key={sIdx} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Passo {sIdx + 1}</div>
                                            <input 
                                                data-path={`businessPage.flows.${fIdx}.steps.${sIdx}.title`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 mb-2 text-white text-sm focus:border-orange-500 outline-none" 
                                                value={step.title} 
                                                onChange={(e) => {
                                                    const newFlows = [...formData.businessPage.flows];
                                                    newFlows[fIdx].steps[sIdx].title = e.target.value;
                                                    setFormData({...formData, businessPage: {...formData.businessPage, flows: newFlows}});
                                                }}
                                            />
                                            <textarea 
                                                data-path={`businessPage.flows.${fIdx}.steps.${sIdx}.description`}
                                                className="w-full bg-black/20 border border-gray-600 rounded p-2 text-white text-xs h-16 focus:border-orange-500 outline-none resize-none" 
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

                    <SectionCard title="Telas (Screenshots)" id="business-screenshots">
                        <Input label="Título" path="businessPage.screenshots.title" />
                        <Input label="Subtítulo" path="businessPage.screenshots.subtitle" />
                        
                        <div className="grid gap-4 mt-6">
                            {formData.businessPage.screenshots.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center p-3 bg-gray-900 rounded-lg border border-gray-700 group">
                                     <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                         <img src={getPreviewSrc(item.image)} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <input 
                                            data-path={`businessPage.screenshots.items.${idx}.image`}
                                            className="w-full bg-transparent border-b border-gray-700 text-white text-sm pb-1 focus:border-orange-500 outline-none" 
                                            value={item.image} 
                                            onChange={(e) => handleArrayChange('businessPage.screenshots.items', idx, 'image', e.target.value)}
                                            placeholder="URL"
                                        />
                                        <input 
                                            data-path={`businessPage.screenshots.items.${idx}.caption`}
                                            className="w-full bg-transparent text-gray-400 text-xs focus:text-white outline-none" 
                                            value={item.caption} 
                                            onChange={(e) => handleArrayChange('businessPage.screenshots.items', idx, 'caption', e.target.value)}
                                            placeholder="Legenda"
                                        />
                                    </div>
                                    <button onClick={() => removeItem('businessPage.screenshots.items', idx)} className="text-gray-500 hover:text-red-500"><Trash size={16}/></button>
                                </div>
                            ))}
                            <button onClick={() => addItem('businessPage.screenshots.items', {image: '', caption: ''})} className="text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded text-white transition">+ Adicionar Print</button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Depoimentos" id="business-testimonials">
                        <Input label="Título" path="businessPage.testimonials.title" />
                        <Input label="Subtítulo" path="businessPage.testimonials.subtitle" />
                        <div className="space-y-4 mt-6">
                            {formData.businessPage.testimonials.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-gray-900 rounded-lg border border-gray-700 relative group">
                                    <button onClick={() => removeItem('businessPage.testimonials.items', idx)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500"><Trash size={16}/></button>
                                    <textarea 
                                        data-path={`businessPage.testimonials.items.${idx}.quote`}
                                        className="w-full bg-transparent border-b border-gray-700 text-white italic mb-2 h-16 focus:border-orange-500 outline-none resize-none"
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

                    <SectionCard title="Chamada para Clientes" id="business-clients">
                        <Input label="Tagline" path="businessPage.forClients.tagline" />
                        <Input label="Título" path="businessPage.forClients.title" />
                        <Input label="Descrição" path="businessPage.forClients.description" textarea />
                        <Input label="Botão" path="businessPage.forClients.button" />
                    </SectionCard>

                    <SectionCard title="CTA Final" id="business-cta">
                        <Input label="Título" path="businessPage.cta.title" />
                        <Input label="Descrição" path="businessPage.cta.description" textarea />
                        <Input label="Botão" path="businessPage.cta.button" />
                    </SectionCard>
                </div>

                <SectionCard title="Rodapé (Global)" id="site-footer">
                    <div className="space-y-4">
                        {formData.homePage.footer.links.map((link: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <div className="flex-grow space-y-2">
                                     <input 
                                        data-path={`homePage.footer.links.${idx}.text`}
                                        className="w-full bg-transparent border-b border-gray-700 text-white text-sm pb-1 focus:border-orange-500 outline-none" 
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