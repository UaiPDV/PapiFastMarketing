import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
	getFirestore,
	doc,
	getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// --- Configuração do Firebase ---
const firebaseConfig = {
	apiKey: 'AIzaSyDmScpF_IsLIWRtltZg09yDpOkYIyE1MrU',
	authDomain: 'papifast-90f21.firebaseapp.com',
	projectId: 'papifast-90f21',
	storageBucket: 'papifast-90f21.appspot.com',
	messagingSenderId: '423481031884',
	appId: '1:423481031884:web:8f2e02e4fd8bc9a0e55669',
	measurementId: 'G-0S2L6TXN0W',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Conteúdo Padrão (Fallback) ---
const defaultContent = {
	hero: {
		title_part1: 'Sua festa organizada de um ',
		title_highlight: 'jeito simples e inovador',
		subtitle:
			'Crie seu evento, envie convites digitais, monte sua lista de presentes e acompanhe tudo em tempo real – direto do celular.',
		primary_button: 'Criar meu evento agora',
		secondary_button: 'Saiba como funciona',
	},
	about: {
		title: 'O jeito moderno de organizar suas comemorações',
		description:
			'O Wevity é o aplicativo que simplifica a organização de festas, aniversários e eventos especiais. Em poucos cliques, você cria seu evento, adiciona produtos ou presentes, envia convites personalizados e acompanha tudo em tempo real.',
	},
	howItWorks: {
		title: 'Seu evento pronto em 4 passos',
		steps: [
			{
				title: 'Crie sua conta',
				description:
					'Faça login ou cadastre-se rapidamente para começar a planejar.',
			},
			{
				title: 'Cadastre seu evento',
				description:
					'Personalize sua festa com tema, data, local e todas as informações.',
			},
			{
				title: 'Monte a lista e convide',
				description:
					'Adicione presentes à sua lista e envie convites digitais com um clique.',
			},
			{
				title: 'Acompanhe tudo',
				description:
					'Receba confirmações de presença e notificações de presentes em tempo real.',
			},
		],
	},
	// MODIFICADO: Estrutura de 'flows' atualizada
	flowsConfig: {
		title: 'Nossos Fluxos',
		subtitle: 'Ciclos simples para organizar seu evento sem complicações.',
	},
	flows: [
		{
			sectionTitle: 'Fluxo Padrão de Evento',
			sectionSubtitle:
				'Este é o ciclo principal para organizar sua festa.',
			steps: [
				{
					title: 'Crie o Evento',
					description:
						'Personalize sua festa com tema, data e local em minutos.',
				},
				{
					title: 'Monte a Lista',
					description:
						'Adicione presentes ou produtos que seus convidados podem comprar.',
				},
				{
					title: 'Envie Convites',
					description:
						'Dispare convites digitais por WhatsApp ou link com um clique.',
				},
				{
					title: 'Acompanhe Tudo',
					description:
						'Receba notificações de presença e presentes em tempo real.',
				},
			],
		},
	],
	features: {
		title: 'Tudo o que você precisa em um só lugar',
		subtitle:
			'Centralize, simplifique e tenha controle total do seu evento na palma da mão.',
		items: [
			{
				title: '🎉 Criar eventos em minutos',
				description: 'Personalize sua festa com facilidade.',
			},
			{
				title: '📩 Enviar convites digitais',
				description: 'Compartilhe via WhatsApp ou link.',
			},
			{
				title: '🎁 Montar lista de presentes',
				description:
					'Seus convidados escolhem e compram direto pelo app.',
			},
			{
				title: '🔔 Receber notificações',
				description:
					'Saiba quando alguém confirmou presença ou comprou presente.',
			},
			{
				title: '🎟 Visualizar cupons e vouchers',
				description: 'Acompanhe tudo organizado no celular.',
			},
			{
				title: '📱 Praticidade para convidados',
				description: 'Diga adeus às listas de papel e grupos confusos.',
			},
		],
	},
	screenshots: {
		title: 'Algumas telas do sistema',
		subtitle:
			'Interface moderna, responsiva e pronta para uso em desktop e mobile.',
		items: [
			{
				image: 'https://placehold.co/600x400/444/fff?text=Gestão+de+Eventos',
				caption: 'Gestão de Eventos',
			},
			{
				image: 'https://placehold.co/600x400/444/fff?text=Detalhes+do+Evento',
				caption: 'Detalhes do Evento',
			},
			{
				image: 'https://placehold.co/600x400/555/fff?text=Lista+de+Presentes',
				caption: 'Lista de Presentes',
			},
			{
				image: 'https://placehold.co/600x400/555/fff?text=Convites+Digitais',
				caption: 'Convites Digitais',
			},
		],
	},
	testimonials: {
		title: 'O que dizem nossos usuários',
		subtitle:
			'A experiência de quem já transformou suas festas com o Wevity.',
		items: [
			{
				quote: '“Montei meu aniversário em minutos e já recebi presentes sem complicação.”',
				author: 'Ana Silva',
			},
			{
				quote: '“Os convites digitais foram um sucesso, meus amigos confirmaram rapidinho!”',
				author: 'João Costa',
			},
			{
				quote: '“A lista de presentes no app é muito prática. Facilitou para mim e para os convidados.”',
				author: 'Mariana Lima',
			},
			{
				quote: '“Finalmente um jeito simples de organizar o chá de bebê. Recomendo!”',
				author: 'Lucas Ferreira',
			},
		],
	},
	businessCta: {
		tagline: 'Você gerencia um estabelecimento ou negócio?',
		title: 'Potencialize seu Negócio com o Wevity',
		subtitle:
			'Uma plataforma completa para gestão de eventos, marketing digital e fidelização de clientes. Aumente suas vendas e fortaleça sua marca.',
		button: 'Conheça Nossa Solução',
		tabs: [
			{
				id: 'gestao',
				title: 'Gestão e Vendas',
				content_title: 'Venda Ingressos e Gerencie Eventos Facilmente',
				content_description:
					'Crie eventos, configure lotes de ingressos e venda online. Acompanhe as vendas em tempo real, gerencie listas de convidados e tenha controle total sobre a bilheteria do seu estabelecimento.',
			},
			{
				id: 'marketing',
				title: 'Marketing Digital',
				content_title: 'Crie Campanhas e Cardápios Digitais Atraentes',
				content_description:
					'Lance campanhas promocionais, crie cardápios digitais interativos com um clique e gere anúncios com IA para impulsionar seus produtos. Envie cupons e vouchers diretamente para o WhatsApp e e-mail de seus clientes.',
			},
			{
				id: 'fidelizacao',
				title: 'Fidelização',
				content_title:
					'Construa um Relacionamento Duradouro com seu Público',
				content_description:
					'Crie uma base de clientes sólida, envie convites personalizados para eventos exclusivos e utilize vouchers de desconto para incentivar o retorno. Transforme clientes em fãs da sua marca com ações de marketing direcionadas.',
			},
		],
	},
	contact: {
		title: 'Pronto para a festa?',
		description:
			'Crie seu evento no Wevity agora e aproveite cada momento sem preocupações.',
		button: 'Criar meu evento agora',
	},
	footer: {
		links: [
			{ text: 'Funcionalidades', href: '#funcionalidades' },
			{ text: 'Como Funciona', href: '#como-funciona' },
			{ text: 'Contato', href: '#' },
			{ text: 'Política de Privacidade', href: '#' },
		],
	},
};

// --- Funções de Renderização de Conteúdo ---

// Helper para popular conteúdo
function setContent(elementId, content, fallback = '') {
	const element = document.getElementById(elementId);
	if (element) {
		element.innerHTML = content || fallback;
	}
}

// MODIFICADO: Função para renderizar os fluxos como carrossel de diagramas
function renderFlows(flowsConfig, flows) {
	// Define o título e subtítulo gerais da seção
	setContent(
		'flows-title',
		flowsConfig?.title || defaultContent.flowsConfig.title
	);
	setContent(
		'flows-subtitle',
		flowsConfig?.subtitle || defaultContent.flowsConfig.subtitle
	);

	const carouselTrack = document.getElementById('carousel-track-flows');
	if (!carouselTrack) return;

	// Garante que 'flows' é um array
	const flowsArray =
		Array.isArray(flows) && flows.length > 0 ? flows : defaultContent.flows;

	carouselTrack.innerHTML = flowsArray
		.map((flow, index) => {
			// Pega os 4 passos (ou objetos vazios como fallback)
			const step1 = flow.steps?.[0] || {
				title: 'Passo 1',
				description: '...',
			};
			const step2 = flow.steps?.[1] || {
				title: 'Passo 2',
				description: '...',
			};
			const step3 = flow.steps?.[2] || {
				title: 'Passo 3',
				description: '...',
			};
			const step4 = flow.steps?.[3] || {
				title: 'Passo 4',
				description: '...',
			};

			// Retorna o HTML completo do slide, incluindo o diagrama 2x2 e o SVG
			return `
            <div class="carousel-slide-flows w-full flex-shrink-0 p-3">
                <div class="unselectable">
                    
                    <!-- TÍTULO E SUBTÍTULO DO FLUXO (SLIDE) -->
                    <div class="text-center mb-8 md:mb-12">
						${
							flow.sectionTitle
								? `<h3 class="text-2xl font-bold text-orange-400 mb-2">${flow.sectionTitle}</h3>`
								: ''
						}
						${
							flow.sectionSubtitle
								? `<p class="text-white/70 text-lg max-w-2xl mx-auto">${flow.sectionSubtitle}</p>`
								: ''
						}
					</div>

                    <!-- Estrutura do Diagrama 2x2 -->
                    <div class="relative max-w-3xl mx-auto">
                        
                        <!-- Grid Container -->
                        <div class="grid grid-cols-2 gap-x-8 gap-y-16 md:gap-x-24 md:gap-y-32">
                            
                            <!-- Step 1 -->
                            <div class="glass rounded-2xl p-6 text-center reveal visible flow-step-box md:cursor-default" 
								 data-title="${step1.title}" data-description="${step1.description}">
                                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full accent shadow-lg mb-4">
                                    <span class="text-2xl font-bold">1</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2">${
									step1.title
								}</h3>
								<!-- Descrição visível em desktop -->
                                <p class="text-white/70 text-sm hidden md:block">${
									step1.description
								}</p>
								<!-- "Saber mais" visível em mobile -->
								<p class="text-orange-400 text-sm font-semibold mt-2 md:hidden">Saber mais...</p>
                            </div>

                            <!-- Step 2 -->
                            <div class="glass rounded-2xl p-6 text-center reveal visible flow-step-box md:cursor-default"
								 data-title="${step2.title}" data-description="${step2.description}">
                                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full accent shadow-lg mb-4">
                                    <span class="text-2xl font-bold">2</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2">${
									step2.title
								}</h3>
                                <p class="text-white/70 text-sm hidden md:block">${
									step2.description
								}</p>
								<p class="text-orange-400 text-sm font-semibold mt-2 md:hidden">Saber mais...</p>
                            </div>

                            <!-- Step 4 (vem antes do 3 no HTML para layout) -->
                            <div class="glass rounded-2xl p-6 text-center reveal visible flow-step-box md:cursor-default"
								 data-title="${step4.title}" data-description="${step4.description}">
                                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full accent shadow-lg mb-4">
                                    <span class="text-2xl font-bold">4</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2">${
									step4.title
								}</h3>
                                <p class="text-white/70 text-sm hidden md:block">${
									step4.description
								}</p>
								<p class="text-orange-400 text-sm font-semibold mt-2 md:hidden">Saber mais...</p>
                            </div>

                            <!-- Step 3 -->
                            <div class="glass rounded-2xl p-6 text-center reveal visible flow-step-box md:cursor-default"
								 data-title="${step3.title}" data-description="${step3.description}">
                                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full accent shadow-lg mb-4">
                                    <span class="text-2xl font-bold">3</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2">${
									step3.title
								}</h3>
                                <p class="text-white/70 text-sm hidden md:block">${
									step3.description
								}</p>
								<p class="text-orange-400 text-sm font-semibold mt-2 md:hidden">Saber mais...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
		})
		.join('');
}

function renderContent(data) {
	const content = {
		...defaultContent,
		...data,
		hero: { ...defaultContent.hero, ...data?.hero },
		about: { ...defaultContent.about, ...data?.about },
		howItWorks: {
			...defaultContent.howItWorks,
			...data?.howItWorks,
		},
		// MODIFICADO: Atualizado para a nova estrutura
		flowsConfig: data?.flowsConfig || defaultContent.flowsConfig,
		flows: data?.flows || defaultContent.flows,
		// ---
		features: { ...defaultContent.features, ...data?.features },
		screenshots: {
			...defaultContent.screenshots,
			...data?.screenshots,
		},
		testimonials: {
			...defaultContent.testimonials,
			...data?.testimonials,
		},
		businessCta: {
			...defaultContent.businessCta,
			...data?.businessCta,
		},
		contact: { ...defaultContent.contact, ...data?.contact },
		footer: { ...defaultContent.footer, ...data?.footer },
	};

	// Hero
	const heroTitleHtml = `${content.hero.title_part1}<span style='background: linear-gradient(90deg, #fb923c, #ef4444); -webkit-background-clip: text; background-clip: text; color: transparent;'>${content.hero.title_highlight}</span>`;
	setContent('hero-title', heroTitleHtml);
	setContent('hero-subtitle', content.hero.subtitle);
	setContent('hero-primary-button', content.hero.primary_button);
	setContent('hero-secondary-button', content.hero.secondary_button);

	// About
	setContent('about-title', content.about.title);
	setContent('about-description', content.about.description);

	// How It Works
	setContent('howItWorks-title', content.howItWorks.title);
	const howItWorksSteps = document.getElementById('howItWorks-steps');
	if (howItWorksSteps) {
		howItWorksSteps.innerHTML = (content.howItWorks.steps || [])
			.map(
				(item, index) => `
			<div class="rounded-3xl glass p-6 cursor-pointer text-center">
				<div class="text-3xl mb-2">${index + 1}.</div>
				<h3 class="text-lg font-semibold mt-1">${item.title}</h3>
				<p class="mt-2 text-sm text-white/80">${item.description}</p>
			</div>
		`
			)
			.join('');
	}

	// Features
	setContent('features-title', content.features.title);
	setContent('features-subtitle', content.features.subtitle);
	const featuresContainer = document.getElementById('features-container');
	if (featuresContainer) {
		featuresContainer.innerHTML = (content.features.items || [])
			.map(
				(item) => `
			<div class="rounded-3xl glass p-6 cursor-pointer"><h3 class="font-semibold">${item.title}</h3><p class="text-white/70 mt-2 text-sm">${item.description}</p></div>
		`
			)
			.join('');
	}

	// Screenshots Carousel
	setContent('screenshots-title', content.screenshots.title);
	setContent('screenshots-subtitle', content.screenshots.subtitle);
	const carouselTrackPrints = document.getElementById(
		'carousel-track-prints'
	);
	if (carouselTrackPrints) {
		carouselTrackPrints.innerHTML = (content.screenshots.items || [])
			.map(
				(item) => `
			<div class="carousel-slide-prints w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
				<div class="rounded-2xl overflow-hidden glass group h-full flex flex-col unselectable">
					<div class="aspect-[16/9] w-full bg-white/6 overflow-hidden">
						<img src="${item.image}" draggable="false" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
					</div>
					<div class="p-4 text-sm text-white/80">${item.caption}</div>
				</div>
			</div>`
			)
			.join('');
	}

	// Testimonials Carousel
	setContent('testimonials-title', content.testimonials.title);
	setContent('testimonials-subtitle', content.testimonials.subtitle);
	const carouselTrack = document.getElementById('carousel-track');
	if (carouselTrack) {
		carouselTrack.innerHTML = (content.testimonials.items || [])
			.map(
				(item) => `
			<div class="carousel-slide w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
				<div class="rounded-2xl overflow-hidden glass group h-full flex flex-col unselectable p-6 justify-center">
					<p class="text-white/80">${item.quote}</p>
					<div class="mt-4 font-semibold text-orange-400">${item.author}</div>
				</div>
			</div>`
			)
			.join('');
	}

	// Business CTA with Tabs
	setContent('businessCta-tagline', content.businessCta.tagline);
	setContent('businessCta-title', content.businessCta.title);
	setContent('businessCta-subtitle', content.businessCta.subtitle);
	setContent('businessCta-button', content.businessCta.button);
	const tabsContainer = document.getElementById('tabs-container');
	if (tabsContainer) {
		tabsContainer.innerHTML = (content.businessCta.tabs || [])
			.map(
				(tab, index) => `
			<button data-tab="${tab.id}" class="tab-btn ${index === 0 ? 'active' : ''}">${
					tab.title
				}</button>
		`
			)
			.join('');
	}
	const tabsContentContainer = document.getElementById(
		'tabs-content-container'
	);
	if (tabsContentContainer) {
		tabsContentContainer.innerHTML = (content.businessCta.tabs || [])
			.map(
				(tab, index) => `
			<div id="${tab.id}" class="tab-content ${index === 0 ? 'active' : ''}">
				<h3 class="text-xl font-bold mb-3">${tab.content_title}</h3>
				<p class="text-white/80">${tab.content_description}</p>
			</div>
		`
			)
			.join('');
	}

	// Contact CTA
	setContent('contact-title', content.contact.title);
	setContent('contact-description', content.contact.description);
	setContent('contact-button', content.contact.button);

	// Footer
	const footerLinks = document.getElementById('footer-links');
	if (footerLinks) {
		footerLinks.innerHTML = (content.footer.links || [])
			.map(
				(link) => `
			<a href="${link.href}" class="hover:text-orange-400 transition-colors">${link.text}</a>
		`
			)
			.join('');
	}

	// Renderiza o fluxo
	renderFlows(content.flowsConfig, content.flows);
}

// --- Função Principal de Carregamento ---

/**
 * Carrega o conteúdo da página do Firebase e renderiza.
 * Usa o `defaultContent` como fallback em caso de erro.
 */
export async function loadContentFromFirebase() {
	try {
		const docSnap = await getDoc(doc(db, 'content', 'pages'));
		const data = docSnap.exists() ? docSnap.data() : {};
		const homePage = data.homePage || {};
		renderContent(homePage);
	} catch (error) {
		console.error('Erro ao carregar do Firebase:', error);
		renderContent({}); // Usa fallback em caso de erro
	}
}
