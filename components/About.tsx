import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Sobre Nós</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="prose prose-lg prose-indigo mx-auto text-slate-600">
          <p className="lead text-xl mb-8">
            Somos uma equipe apaixonada por tecnologia e design, dedicados a criar experiências digitais que transformam negócios e conectam pessoas.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
             <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="https://picsum.photos/400/300?grayscale" alt="Office" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col justify-center">
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Nossa Missão</h3>
                 <p className="mb-4">
                    Democratizar o acesso a ferramentas digitais de alta qualidade, permitindo que empreendedores de todos os níveis alcancem seu potencial máximo.
                 </p>
                 <p>
                    Acreditamos que a simplicidade é o último grau de sofisticação.
                 </p>
             </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Nossa História</h3>
          <p className="mb-6">
            Fundada em 2024, começamos como um pequeno estúdio de design. Percebendo a necessidade de soluções mais ágeis no mercado, pivotamos para o desenvolvimento de componentes e templates React de alta performance.
          </p>
          <p>
            Hoje, ajudamos milhares de desenvolvedores a entregarem projetos incríveis em tempo recorde, sem sacrificar a qualidade ou a beleza do código.
          </p>

           <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mt-12 rounded-r-lg">
            <p className="italic text-indigo-900 m-0">
              "A inovação distingue um líder de um seguidor."
            </p>
            <p className="text-indigo-700 font-bold mt-2">- Steve Jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
};