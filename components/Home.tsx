import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { Carousel } from './Carousel';
import { resolveAssetPath } from '../utils/media';

export const Home: React.FC = () => {
	const { content, loading } = useContent();
	const [activeTab, setActiveTab] = useState(0);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Carregando...
			</div>
		);

	const data = content.homePage;
	const heroImages = [
		resolveAssetPath('img/foto3.png'),
		resolveAssetPath('img/foto2.png'),
		resolveAssetPath('img/foto4.png'),
	];
	const getImageSrc = (src?: string) =>
		resolveAssetPath(src) ||
		src ||
		'https://placehold.co/600x400/1f2937/ffffff?text=Preview';

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
								<span className="text-gradient">
									{data.hero.title_highlight}
								</span>
							</h1>
							<p className="mt-4 opacity-80 max-w-2xl text-lg mx-auto lg:mx-0">
								{data.hero.subtitle}
							</p>
							<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<button className="accent px-8 py-3 rounded-xl font-semibold shadow-lg transition hover:scale-105">
									{data.hero.primary_button}
								</button>
								<button className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition hover:scale-105 border border-white/10">
									{data.hero.secondary_button}
								</button>
							</div>
						</div>

						{/* Hero Images - 3 Images Layout */}
						<div className="relative mt-12 lg:mt-0 h-80 sm:h-96 reveal">
							{/* Imagem Esquerda */}
							<img
								src={heroImages[0]}
								className="absolute top-0 left-0 w-2/3 rounded-2xl shadow-2xl transform -rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer border border-white/5"
								alt="App Left"
							/>
							{/* Imagem Direita */}
							<img
								src={heroImages[1]}
								className="absolute top-0 right-0 w-2/3 rounded-2xl shadow-2xl transform rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer border border-white/5"
								alt="App Right"
							/>
							{/* Imagem Central (Frente) */}
							<img
								src={heroImages[2]}
								className="absolute top-1/4 left-1/2 w-2/3 -translate-x-1/2 rounded-2xl shadow-2xl z-10 border-4 border-black/20 transform hover:scale-105 transition-transform cursor-pointer"
								alt="App Center"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* About */}
			<section id="sobre" className="py-16 border-t border-white/10">
				<div className="max-w-3xl mx-auto px-4 text-center reveal">
					<h2 className="text-2xl md:text-3xl font-bold">
						{data.about.title}
					</h2>
					<p className="mt-4 opacity-80">{data.about.description}</p>
				</div>
			</section>

			{/* How It Works */}
			<section
				id="how-it-works"
				className="py-16 border-t border-white/10"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold">
						{data.howItWorks.title}
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
						{data.howItWorks.steps.map((step: any, idx: number) => (
							<div
								key={idx}
								className="glass p-6 rounded-3xl reveal hover:bg-white/5 transition cursor-default"
							>
								<div className="text-3xl mb-2 font-bold text-orange-500">
									{idx + 1}.
								</div>
								<h3 className="text-lg font-semibold">
									{step.title}
								</h3>
								<p className="mt-2 text-sm opacity-80">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section id="features" className="py-16 border-t border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold">
						{data.features.title}
					</h2>
					<p className="mt-2 opacity-70 max-w-2xl mx-auto">
						{data.features.subtitle}
					</p>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 text-left">
						{data.features.items.map((item: any, idx: number) => (
							<div
								key={idx}
								className="glass p-6 rounded-3xl hover:bg-white/5 transition reveal"
							>
								<h3 className="font-semibold text-lg">
									{item.title}
								</h3>
								<p className="mt-2 text-sm opacity-70">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Flows Carousel */}
			<section
				id="flows"
				className="py-16 border-t border-white/10 overflow-hidden"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold">
							{data.flowsConfig.title}
						</h2>
						<p className="opacity-70 mt-2 max-w-3xl mx-auto">
							{data.flowsConfig.subtitle}
						</p>
					</div>

					{data.flows && data.flows.length > 0 ? (
						<Carousel slidesToShow={1}>
							{data.flows.map((flow: any, idx: number) => (
								<div key={idx} className="w-full px-4">
									<div className="text-center mb-8">
										<h3 className="text-2xl font-bold text-orange-400">
											{flow.sectionTitle}
										</h3>
										<p className="opacity-70 max-w-2xl mx-auto">
											{flow.sectionSubtitle}
										</p>
									</div>
									{/* Diagram Layout 2x2 */}
									<div className="grid grid-cols-2 gap-x-8 gap-y-12 md:gap-x-24 md:gap-y-16 max-w-3xl mx-auto relative">
										{flow.steps.map(
											(step: any, sIdx: number) => (
												<div
													key={sIdx}
													className={`glass rounded-2xl p-6 text-center relative z-10 transform transition duration-500 hover:scale-105 cursor-default border border-white/5`}
												>
													<div className="w-16 h-16 rounded-full accent flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-lg">
														{sIdx + 1}
													</div>
													<h4 className="font-semibold text-lg mb-2">
														{step.title}
													</h4>
													<p className="text-sm opacity-70 hidden md:block">
														{step.description}
													</p>
													<p className="text-orange-400 text-xs font-bold mt-2 md:hidden uppercase tracking-wide">
														Ver mais
													</p>
												</div>
											)
										)}
									</div>
								</div>
							))}
						</Carousel>
					) : (
						<div className="text-center opacity-50">
							Nenhum fluxo configurado.
						</div>
					)}
				</div>
			</section>

			{/* Screenshots */}
			<section
				id="screenshots"
				className="py-16 border-t border-white/10"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl md:text-3xl font-bold text-center">
						{data.screenshots.title}
					</h2>
					<p className="text-center mt-2 opacity-70 mb-10">
						{data.screenshots.subtitle}
					</p>

					{data.screenshots.items &&
					data.screenshots.items.length > 0 ? (
						<Carousel slidesToShow={3}>
							{data.screenshots.items.map(
								(item: any, idx: number) => (
									<div
										key={idx}
										className="glass rounded-2xl overflow-hidden group border border-white/5"
									>
										<div className="aspect-video bg-black/20 overflow-hidden relative">
											<img
												src={getImageSrc(item.image)}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												alt={item.caption}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										</div>
										<div className="p-4 text-sm opacity-80 text-center font-medium">
											{item.caption}
										</div>
									</div>
								)
							)}
						</Carousel>
					) : (
						<div className="text-center opacity-50">
							Nenhuma imagem disponível.
						</div>
					)}
				</div>
			</section>

			{/* Testimonials */}
			<section
				id="testimonials"
				className="py-16 border-t border-white/10"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-bold">
							{data.testimonials.title}
						</h2>
						<p className="mt-2 opacity-70 max-w-2xl mx-auto">
							{data.testimonials.subtitle}
						</p>
					</div>

					{data.testimonials.items &&
					data.testimonials.items.length > 0 ? (
						<Carousel slidesToShow={3}>
							{data.testimonials.items.map(
								(item: any, idx: number) => (
									<div key={idx} className="h-full">
										<div className="glass rounded-2xl p-8 text-center h-full flex flex-col justify-center border border-white/5 hover:border-white/20 transition">
											<div className="text-orange-500 text-4xl mb-4 font-serif">
												"
											</div>
											<p className="opacity-80 italic mb-6 flex-grow">
												{item.quote}
											</p>
											<div className="font-semibold text-orange-400">
												{item.author}
											</div>
										</div>
									</div>
								)
							)}
						</Carousel>
					) : (
						<div className="text-center opacity-50">
							Nenhum depoimento disponível.
						</div>
					)}
				</div>
			</section>

			{/* Business CTA Tabs */}
			<section
				id="para-empresas"
				className="py-16 border-t border-white/10"
			>
				<div className="max-w-4xl mx-auto px-4 text-center">
					<p className="font-semibold text-orange-400 uppercase tracking-wide text-sm">
						{data.businessCta.tagline}
					</p>
					<h2 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">
						{data.businessCta.title}
					</h2>
					<p className="mt-4 opacity-80 text-lg">
						{data.businessCta.subtitle}
					</p>

					<div className="flex flex-wrap justify-center gap-2 mt-8 bg-white/5 p-1.5 rounded-xl inline-flex">
						{data.businessCta.tabs.map((tab: any, idx: number) => (
							<button
								key={idx}
								onClick={() => setActiveTab(idx)}
								className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
									activeTab === idx
										? 'accent shadow-lg text-white'
										: 'hover:bg-white/5 text-white/70'
								}`}
							>
								{tab.title}
							</button>
						))}
					</div>

					<div className="mt-8 glass p-8 rounded-3xl border border-white/10 transition-all duration-500">
						<div key={activeTab} className="animate-fadeIn">
							<h3 className="text-2xl font-bold mb-3 text-orange-400">
								{data.businessCta.tabs[activeTab].content_title}
							</h3>
							<p className="opacity-80 text-lg leading-relaxed">
								{
									data.businessCta.tabs[activeTab]
										.content_description
								}
							</p>
						</div>
					</div>

					<div className="mt-10">
						<a
							href="#/business"
							className="inline-flex items-center gap-2 accent px-8 py-3 rounded-xl font-bold shadow-lg transition hover:scale-105"
						>
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
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
								{data.contact.title}
							</h2>
							<p className="mt-2 opacity-80 text-lg">
								{data.contact.description}
							</p>
						</div>
						<button className="accent px-8 py-4 rounded-xl font-bold shadow-lg whitespace-nowrap text-lg transition hover:scale-105">
							{data.contact.button}
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};
