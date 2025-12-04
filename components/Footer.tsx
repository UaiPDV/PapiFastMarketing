import React from 'react';

interface FooterProps {
    links?: { text: string; href: string }[];
}

export const Footer: React.FC<FooterProps> = ({ links }) => {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm opacity-50">
          © {new Date().getFullYear()} PapiFast. Todos os direitos reservados.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm opacity-70">
            {links ? links.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:text-orange-400 transition-colors">
                    {link.text}
                </a>
            )) : (
                <>
                    <a href="#" className="hover:text-orange-400 transition-colors">Contato</a>
                    <a href="#" className="hover:text-orange-400 transition-colors">Política de Privacidade</a>
                </>
            )}
        </div>
      </div>
    </footer>
  );
};