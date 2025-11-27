import React from 'react';
import { useContent } from '../hooks/useContent';
import { Carousel } from './Carousel';
import { resolveAssetPath } from '../utils/media';

export const Business: React.FC = () => {
  const { content, loading } = useContent();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const data = content.businessPage;
    const getImageSrc = (src?: string) => resolveAssetPath(src) || src || 'https://placehold.co/600x400/111/fff?text=Preview';

  return (
    <div className="flex flex-col">
       {/* Hero */}
       <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 text-center">
            <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.45),transparent_40%)]"></div>
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">{data.hero.title}</h1>
                <p className="text-lg opacity-80 max-w-3xl mx-auto mb-8">{data.hero.subtitle}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="accent px-8 py-3 rounded-xl font-bold shadow-lg transition hover:scale-105">{data.hero.cta_button}</button>
                    <button className="bg-white/10 px-8 py-3 rounded-xl font-bold hover:bg-white/15 transition hover:scale-105 border border-white/10">{data.hero.secondary_button}</button>
                </div>
            </div>
       </section>

       {/* Value Proposition */}
       <section id="value-proposition" className="py-16 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">{data.valueProposition.title}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {data.valueProposition.items.map((item: any, idx: number) => (
                        <div key={idx} className="glass p-6 rounded-2xl text-left hover:bg-white/5 transition border border-white/5">
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center mb-4" dangerouslySetInnerHTML={{ __html: item.icon }} />
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="opacity-70">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
       </section>

       {/* Info Sections */}
       <section className="py-16 border-t border-white/10">
           <div className="max-w-7xl mx-auto px-4 space-y-24">
               {data.infoSections.map((section: any, idx: number) => (
                   <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''} reveal`}>
                       <div className="flex-1">
                           <h3 className="text-3xl font-bold mb-4">{section.title}</h3>
                           <p className="opacity-80 mb-6">{section.description}</p>
                           <ul className="space-y-3">
                               {section.points.map((point: string, pIdx: number) => (
                                   <li key={pIdx} className="flex items-start gap-3">
                                       <span className="text-orange-500 font-bold mt-1">✓</span> 
                                       <span className="opacity-80">{point}</span>
                                   </li>
                               ))}
                           </ul>
                       </div>
                       <div className="flex-1 w-full">
                           <img src={getImageSrc(section.image)} alt={section.title} className="rounded-2xl shadow-2xl w-full object-cover border border-white/10" />
                       </div>
                   </div>
               ))}
           </div>
       </section>
       
       {/* Features */}
       <section id="features" className="py-16 border-t border-white/10">
           <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold">{data.features.title}</h2>
                <p className="opacity-70 mt-2 mb-12 max-w-2xl mx-auto">{data.features.subtitle}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {data.features.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition">
                            <div className="w-12 h-12 flex-shrink-0 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center" dangerouslySetInnerHTML={{ __html: item.icon }} />
                            <div>
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="opacity-70 text-sm mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
           </div>
       </section>

       {/* Flows Carousel */}
       <section id="flows" className="py-16 border-t border-white/10 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold">{data.flowsConfig.title}</h2>
                 <p className="opacity-70 mt-2 max-w-3xl mx-auto">{data.flowsConfig.subtitle}</p>
             </div>
             
             {data.flows && data.flows.length > 0 ? (
                <Carousel slidesToShow={1}>
                    {data.flows.map((flow: any, idx: number) => (
                        <div key={idx} className="w-full px-4">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-orange-400">{flow.sectionTitle}</h3>
                                <p className="opacity-70 max-w-2xl mx-auto">{flow.sectionSubtitle}</p>
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
                                       <p className="text-orange-400 text-xs font-bold mt-2 md:hidden uppercase tracking-wide">Ver mais</p>
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
                          <div key={idx} className="glass rounded-2xl overflow-hidden group border border-white/5 h-full">
                              <div className="aspect-video bg-black/20 overflow-hidden relative">
                                  <img src={getImageSrc(item.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.caption} />
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

       {/* For Clients CTA */}
       <section className="py-16 border-t border-white/10">
            <div className="max-w-5xl mx-auto px-4">
                <div className="glass rounded-3xl p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                   <div>
                       <p className="text-orange-400 font-semibold tracking-wide uppercase text-sm">{data.forClients.tagline}</p>
                       <h2 className="text-3xl font-bold mt-2">{data.forClients.title}</h2>
                       <p className="mt-4 opacity-80 text-lg">{data.forClients.description}</p>
                   </div>
                   <button className="accent px-8 py-3 rounded-xl font-bold shadow-lg whitespace-nowrap transition hover:scale-105">
                       {data.forClients.button}
                   </button>
                </div>
            </div>
       </section>

       {/* Final CTA */}
       <section id="cta" className="py-20 border-t border-white/10 text-center">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4">{data.cta.title}</h2>
                <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">{data.cta.description}</p>
                <div className="flex justify-center">
                    <button className="accent px-8 py-4 rounded-xl font-bold shadow-lg transition hover:scale-105 text-lg">
                        {data.cta.button}
                    </button>
                </div>
            </div>
       </section>
    </div>
  );
};