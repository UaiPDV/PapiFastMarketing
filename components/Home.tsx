
import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { Carousel } from './Carousel';
import { X } from 'lucide-react';

export const Home: React.FC = () => {
  const { content, loading } = useContent();
  const [activeTab, setActiveTab] = useState(0);
  const [stepModal, setStepModal] = useState<any>(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const data = content.homePage;

  // Garantir compatibilidade com dados antigos ou novos
  const aboutImages = data.about.images || (data.about.image ? [data.about.image] : []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.45),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
             <div className="text-center lg:text-left reveal">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter">
                   {data.hero.title_part1}
                   <span className="text-gradient">{data.hero.title_highlight}</span>
                </h1>
                <p className="mt-4 opacity-80 max-w-2xl text-lg mx-auto lg:mx-0">
                    {data.hero.subtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a 
                      href={data.hero.primary_button_link || "https://printweb.vlks.com.br"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="accent px-8 py-3 rounded-xl font-semibold shadow-lg transition hover:scale-105 inline-flex items-center justify-center"
                    >
                        {data.hero.primary_button}
                    </a>
                    <button className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition hover:scale-105 border border-white/10">
                        {data.hero.secondary_button}
                    </button>
                </div>
             </div>
             
             {/* Hero Images - 3 Images Layout */}
             <div className="relative mt-12 lg:mt-0 h-80 sm:h-96 reveal">
                 {/* Imagem Esquerda */}
                 <img 
                    src={data.hero.image_left || "https://placehold.co/400x800/222/fff?text=App+Left"} 
                    className="absolute top-0 left-0 w-2/3 rounded-2xl shadow-2xl transform -rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer border border-white/5" 
                    alt="App Left" 
                 />
                 {/* Imagem Direita */}
                 <img 
                    src={data.hero.image_right || "https://placehold.co/400x800/333/fff?text=App+Right"} 
                    className="absolute top-0 right-0 w-2/3 rounded-2xl shadow-2xl transform rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer border border-white/5" 
                    alt="App Right" 
                 />
                 {/* Imagem Central (Frente) */}
                 <img 
                    src={data.hero.image_center || "https://placehold.co/400x800/444/fff?text=App+Center"} 
                    className="absolute top-1/4 left-1/2 w-2/3 -translate-x-1/2 rounded-2xl shadow-2xl z-10 border-4 border-black/20 transform hover:scale-105 transition-transform cursor-pointer" 
                    alt="App Center" 
                 />
             </div>
           </div>
        </div>
      </section>

      {/* About (Scattered Photos Style) */}
      <section id="sobre" className="py-24 border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left order-2 lg:order-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{data.about.title}</h2>
                    <p className="opacity-80 text-lg leading-relaxed">{data.about.description}</p>
                </div>
                
                {/* Scattered Gallery Container */}
                <div className="relative h-96 w-full order-1 lg:order-2 flex items-center justify-center">
                    {aboutImages.length > 0 ? (
                        aboutImages.map((img: string, idx: number) => {
                            // Define rotation and position offsets based on index to create "scattered" look
                            const rotations = ['rotate-[-6deg]', 'rotate-[8deg]', 'rotate-[-3deg]', 'rotate-[5deg]'];
                            const positions = [
                                'top-0 left-4 z-10', 
                                'bottom-4 right-4 z-20', 
                                'top-12 right-12 z-0', 
                                'bottom-8 left-8 z-30'
                            ];
                            
                            // Safe fallback for styles if more images than defined styles
                            const rot = rotations[idx % rotations.length];
                            const pos = positions[idx % positions.length];
                            
                            return (
                                <div 
                                    key={idx}
                                    className={`absolute transition-all duration-500 hover:scale-110 hover:z-50 hover:rotate-0 group cursor-pointer ${idx >= 4 ? 'hidden' : ''} ${idx === 0 ? 'relative' : pos}`}
                                    style={{ 
                                        // Slight manual offsets to break the grid feel if needed
                                        marginTop: idx === 0 ? '0' : `${(idx * 10) - 20}px` 
                                    }}
                                >
                                    <div className={`p-2 bg-white shadow-2xl transform ${rot} transition-transform duration-500 group-hover:rotate-0`}>
                                        <div className="overflow-hidden aspect-[4/5] w-48 sm:w-56">
                                            <img 
                                                src={img} 
                                                alt={`Sobre ${idx + 1}`} 
                                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                         <div className="relative group">
                             <div className="absolute inset-0 bg-orange-500/10 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-0"></div>
                             <img 
                                src="https://placehold.co/600x400/222/fff?text=Sobre" 
                                alt="Sobre" 
                                className="relative rounded-3xl shadow-2xl w-full object-cover border border-white/10"
                             />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-10 reveal">
                <h2 className="text-2xl md:text-3xl font-bold">{data.howItWorks.title}</h2>
             </div>
             
             <div className={`grid ${data.howItWorks.image ? 'lg:grid-cols-2' : ''} gap-12 items-center`}>
                 {/* Image if exists */}
                 {data.howItWorks.image && (
                     <div className="reveal relative group order-last lg:order-first">
                         <div className="absolute inset-0 bg-orange-500/10 rounded-3xl transform -rotate-3 transition-transform group-hover:rotate-0"></div>
                         <img 
                            src={data.howItWorks.image} 
                            alt="Como Funciona" 
                            className="relative rounded-3xl shadow-2xl w-full object-cover border border-white/10"
                         />
                     </div>
                 )}
                 
                 {/* Steps */}
                 <div className={`grid md:grid-cols-2 ${!data.howItWorks.image ? 'lg:grid-cols-4' : 'gap-6'} gap-6`}>
                     {data.howItWorks.steps.map((step: any, idx: number) => (
                         <div key={idx} className="glass p-6 rounded-3xl reveal hover:bg-white/5 transition cursor-default">
                             <div className="text-3xl mb-2 font-bold text-orange-500">{idx + 1}.</div>
                             <h3 className="text-lg font-semibold">{step.title}</h3>
                             <p className="mt-2 text-sm opacity-80">{step.description}</p>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 border-t border-white/10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-2xl md:text-3xl font-bold">{data.features.title}</h2>
             <p className="mt-2 opacity-70 max-w-2xl mx-auto">{data.features.subtitle}</p>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 text-left">
                {data.features.items.map((item: any, idx: number) => (
                    <div key={idx} className="glass p-6 rounded-3xl hover:bg-white/5 transition reveal">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="mt-2 text-sm opacity-70">{item.description}</p>
                    </div>
                ))}
             </div>
         </div>
      </section>

      {/* Use Cases (Segments Style) */}
      {data.useCases && (
           <section id="use-cases" className="py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-orange-400 font-semibold uppercase tracking-wider text-sm mb-2">PARA VOCÊ</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.useCases.title}</h2>
                    <p className="opacity-70 mt-2 mb-12 max-w-2xl mx-auto">{data.useCases.subtitle}</p>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.useCases.items.map((item: any, idx: number) => (
                            <div key={idx} className="glass p-6 rounded-3xl hover:bg-white/5 transition group">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-orange-500 transition-colors shadow-lg">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm opacity-70 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
           </section>
       )}

      {/* Flows Carousel */}
      <section id="flows" className="py-16 border-t border-white/10 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                 <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                    {data.flowsConfig.title}
                 </h2>
                 <p className="opacity-70 mt-2 max-w-3xl mx-auto text-lg">{data.flowsConfig.subtitle}</p>
             </div>
             
             {data.flows && data.flows.length > 0 ? (
                <Carousel slidesToShow={1}>
                    {data.flows.map((flow: any, idx: number) => (
                        <div key={idx} className="w-full px-4">
                            <div className="text-center mb-10">
                                <h3 className="text-2xl md:text-3xl font-bold text-orange-400">{flow.sectionTitle}</h3>
                                <p className="opacity-70 max-w-2xl mx-auto mt-2 text-lg">{flow.sectionSubtitle}</p>
                            </div>
                            {/* Diagram Layout 2x2 */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:gap-x-24 md:gap-y-16 max-w-3xl mx-auto relative">
                               {flow.steps.map((step: any, sIdx: number) => (
                                   <div key={sIdx} className={`glass rounded-2xl p-6 text-center relative z-10 transform transition duration-500 hover:scale-105 cursor-default border border-white/5`}>
                                       <div className="w-16 h-16 rounded-full accent flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-lg">
                                           {sIdx + 1}
                                       </div>
                                       <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                                       <p className="text-sm opacity-70 hidden md:block">{step.description}</p>
                                       <button 
                                            onClick={() => setStepModal({ number: sIdx + 1, title: step.title, description: step.description })}
                                            className="text-orange-400 text-xs font-bold mt-2 md:hidden uppercase tracking-wide hover:text-orange-300 transition-colors w-full"
                                        >
                                            Ver mais
                                       </button>
                                   </div>
                               ))}
                            </div>
                        </div>
                    ))}
                </Carousel>
             ) : (
                <div className="text-center opacity-50">Nenhum fluxo configurado.</div>
             )}
         </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center">{data.screenshots.title}</h2>
              <p className="text-center mt-2 opacity-70 mb-10">{data.screenshots.subtitle}</p>
              
              {data.screenshots.items && data.screenshots.items.length > 0 ? (
                  <Carousel slidesToShow={3}>
                      {data.screenshots.items.map((item: any, idx: number) => (
                          <div key={idx} className="glass rounded-2xl overflow-hidden group border border-white/5">
                              <div className="aspect-video bg-black/20 overflow-hidden relative">
                                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.caption} />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="p-4 text-sm opacity-80 text-center font-medium">{item.caption}</div>
                          </div>
                      ))}
                  </Carousel>
              ) : (
                <div className="text-center opacity-50">Nenhuma imagem disponível.</div>
              )}
          </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold">{data.testimonials.title}</h2>
                  <p className="mt-2 opacity-70 max-w-2xl mx-auto">{data.testimonials.subtitle}</p>
              </div>
              
              {data.testimonials.items && data.testimonials.items.length > 0 ? (
                  <Carousel slidesToShow={3}>
                      {data.testimonials.items.map((item: any, idx: number) => (
                          <div key={idx} className="h-full">
                              <div className="glass rounded-2xl p-8 text-center h-full flex flex-col justify-center border border-white/5 hover:border-white/20 transition">
                                  <div className="text-orange-500 text-4xl mb-4 font-serif">"</div>
                                  <p className="opacity-80 italic mb-6 flex-grow">{item.quote}</p>
                                  <div className="font-semibold text-orange-400">{item.author}</div>
                              </div>
                          </div>
                      ))}
                  </Carousel>
               ) : (
                  <div className="text-center opacity-50">Nenhum depoimento disponível.</div>
               )}
          </div>
      </section>

      {/* Business CTA Tabs */}
      <section id="para-empresas" className="py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <p className="font-semibold text-orange-400 uppercase tracking-wide text-sm">{data.businessCta.tagline}</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">{data.businessCta.title}</h2>
              <p className="mt-4 opacity-80 text-lg">{data.businessCta.subtitle}</p>

              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-8 bg-white/5 p-1.5 rounded-xl w-full max-w-3xl mx-auto">
                  {data.businessCta.tabs.map((tab: any, idx: number) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === idx ? 'accent shadow-lg text-white' : 'hover:bg-white/5 text-white/70 tab-inactive'}`}
                      >
                          {tab.title}
                      </button>
                  ))}
              </div>

              <div className="mt-8 glass p-8 rounded-3xl border border-white/10 transition-all duration-500">
                  <div key={activeTab} className="animate-fadeIn">
                    <h3 className="text-2xl font-bold mb-3 text-orange-400">{data.businessCta.tabs[activeTab].content_title}</h3>
                    <p className="opacity-80 text-lg leading-relaxed">{data.businessCta.tabs[activeTab].content_description}</p>
                  </div>
              </div>
              
              <div className="mt-10">
                  <a href="#/business" className="inline-flex items-center gap-2 accent px-8 py-3 rounded-xl font-bold shadow-lg transition hover:scale-105">
                     {data.businessCta.button}
                  </a>
              </div>
          </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{data.contact.title}</h2>
                      <p className="mt-2 opacity-80 text-lg">{data.contact.description}</p>
                  </div>
                  <button className="accent px-8 py-4 rounded-xl font-bold shadow-lg whitespace-nowrap text-lg transition hover:scale-105">
                      {data.contact.button}
                  </button>
              </div>
          </div>
      </section>

      {/* Modal for Mobile Steps */}
      {stepModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={() => setStepModal(null)}></div>
            <div className="relative bg-[#18181b] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
                <button 
                    onClick={() => setStepModal(null)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="w-20 h-20 rounded-full accent flex items-center justify-center mx-auto mb-6 font-bold text-3xl shadow-lg text-white">
                    {stepModal.number}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-white">{stepModal.title}</h3>
                <p className="text-white/80 leading-relaxed text-center text-lg">
                    {stepModal.description}
                </p>
            </div>
        </div>
      )}
    </div>
  );
};
