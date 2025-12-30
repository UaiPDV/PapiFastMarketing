import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isDark, setIsDark] = useState(true);
	const location = useLocation();

	const isBusiness = location.pathname.includes('/business');
	const isAdmin = location.pathname.includes('/admin');

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'light') {
			setIsDark(false);
			document.body.classList.add('light-theme');
		} else {
			setIsDark(true);
			document.body.classList.remove('light-theme');
		}
	}, []);

	const toggleTheme = () => {
		setIsDark(!isDark);
		if (isDark) {
			document.body.classList.add('light-theme');
			localStorage.setItem('theme', 'light');
		} else {
			document.body.classList.remove('light-theme');
			localStorage.setItem('theme', 'dark');
		}
	};

	const getNavLinks = () => {
		if (isAdmin) return [];

		return isBusiness
			? [
					{ name: 'Proposta', path: '#value-proposition' },
					{ name: 'Funcionalidades', path: '#features' },
					{ name: 'Telas', path: '#screenshots' },
					{ name: 'Parceiros', path: '#testimonials' },
					{ name: 'Para Clientes', path: '/' },
			  ]
			: [
					{ name: 'O que é', path: '#sobre' },
					{ name: 'Como Funciona', path: '#how-it-works' },
					{ name: 'Funcionalidades', path: '#features' },
					{ name: 'Depoimentos', path: '#testimonials' },
					{ name: 'Para Empresas', path: '/business' },
					{ name: 'Contato', path: '#contact' },
			  ];
	};

	const navLinks = getNavLinks();

	const getLogoText = () => {
		if (isAdmin) return 'PapiFast Admin';
		return isBusiness ? 'PapiFast Business' : 'PapiFast';
	};

	const logoText = getLogoText();
	const primaryCtaHref = isBusiness
		? 'https://api.whatsapp.com/send?l=pt_BR&phone=553193585185'
		: 'https://printweb.vlks.com.br';

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id.replace('#', ''));
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		setIsOpen(false);
	};

	return (
		<nav
			className={`fixed w-full z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
				isDark
					? 'bg-[#0f0f11]/80 border-white/10'
					: 'bg-white/80 border-slate-200'
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<Link
						to={isAdmin ? '/admin' : '/'}
						className="flex items-center gap-3 group"
					>
						<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover:scale-105">
							<img
								src="https://printweb.vlks.com.br/imagens/novaLogo1.png"
								alt="Logo"
								className="object-cover"
							/>
						</div>
						<span
							className={`font-bold tracking-tight text-xl ${
								isDark ? 'text-white' : 'text-slate-900'
							}`}
						>
							{logoText}
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center gap-6 xl:gap-8">
						{navLinks.map((link) =>
							link.path.startsWith('#') ? (
								<button
									key={link.name}
									onClick={() => scrollToSection(link.path)}
									className={`text-sm font-medium transition-colors hover:text-orange-500 ${
										isDark
											? 'text-white/80 hover:text-white'
											: 'text-slate-600 hover:text-slate-900'
									}`}
								>
									{link.name}
								</button>
							) : (
								<Link
									key={link.name}
									to={link.path}
									className={`text-sm font-medium transition-colors hover:text-orange-500 ${
										isDark
											? 'text-white/80 hover:text-white'
											: 'text-slate-600 hover:text-slate-900'
									}`}
								>
									{link.name}
								</Link>
							)
						)}

						<div className="flex items-center gap-3 pl-4 border-l border-white/10">
							<button
								onClick={toggleTheme}
								className={`p-2 rounded-xl border transition ${
									isDark
										? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
										: 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
								}`}
							>
								{isDark ? (
									<Sun className="h-5 w-5" />
								) : (
									<Moon className="h-5 w-5" />
								)}
							</button>

							{isAdmin ? (
								<Link
									to="/"
									className="accent px-5 py-2.5 rounded-xl text-white shadow-lg text-sm font-bold transition hover:scale-105"
								>
									Sair
								</Link>
							) : (
								<a
									href={primaryCtaHref}
									target="_blank"
									rel="noopener noreferrer"
									className="accent px-5 py-2.5 rounded-xl text-white shadow-lg text-sm font-bold transition hover:scale-105"
								>
									{isBusiness
										? 'Agendar Demo'
										: 'Começar Agora'}
								</a>
							)}
						</div>
					</div>

					{/* Mobile Menu Button */}
					<div className="lg:hidden flex items-center gap-4">
						<button
							onClick={toggleTheme}
							className={`p-2 rounded-xl border transition ${
								isDark
									? 'border-white/10 bg-white/10 text-white'
									: 'border-slate-200 bg-slate-100 text-slate-700'
							}`}
						>
							{isDark ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</button>
						{!isAdmin && (
							<button
								onClick={() => setIsOpen(!isOpen)}
								className={`p-2 rounded-xl ${
									isDark
										? 'text-white hover:bg-white/10'
										: 'text-slate-900 hover:bg-slate-100'
								} focus:outline-none transition`}
							>
								{isOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isOpen && !isAdmin && (
				<div
					className={`lg:hidden border-t ${
						isDark
							? 'bg-[#0f0f11] border-white/10'
							: 'bg-white border-slate-200'
					} absolute w-full shadow-2xl`}
				>
					<div className="px-4 pt-2 pb-6 space-y-2">
						{navLinks.map((link) =>
							link.path.startsWith('#') ? (
								<button
									key={link.name}
									onClick={() => scrollToSection(link.path)}
									className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition ${
										isDark
											? 'text-white hover:bg-white/10'
											: 'text-slate-900 hover:bg-slate-100'
									}`}
								>
									{link.name}
								</button>
							) : (
								<Link
									key={link.name}
									to={link.path}
									onClick={() => setIsOpen(false)}
									className={`block px-4 py-3 rounded-xl text-base font-medium transition ${
										isDark
											? 'text-white hover:bg-white/10'
											: 'text-slate-900 hover:bg-slate-100'
									}`}
								>
									{link.name}
								</Link>
							)
						)}

						<div className="pt-4 mt-2 border-t border-white/5">
							<a
								href={primaryCtaHref}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full inline-flex justify-center accent px-4 py-3 rounded-xl text-white shadow-lg text-base font-bold"
							>
								{isBusiness ? 'Agendar Demo' : 'Começar Agora'}
							</a>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};
