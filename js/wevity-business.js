import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
	getFirestore,
	doc,
	getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	},
	{ threshold: 0.1 }
);

function observeRevealElements() {
	document.querySelectorAll('.reveal').forEach((el) => {
		observer.observe(el);
	});
}

function setContent(elementId, content) {
	const element = document.getElementById(elementId);
	if (element) element.innerHTML = content || '';
}

// --- NOVO: Lógica do Modal do Fluxo (copiado de app.js) ---
function setupFlowModal() {
	const modal = document.getElementById('flow-step-modal');
	const modalTitle = document.getElementById('modal-title');
	const modalDescription = document.getElementById('modal-description');
	const closeModalBtn = document.getElementById('modal-close-btn');
	const modalOverlay = document.getElementById('modal-overlay');

	if (!modal || !modalTitle || !modalDescription || !closeModalBtn) {
		return;
	}

	const showModal = (title, description) => {
		modalTitle.textContent = title || '';
		modalDescription.textContent = description || '';
		modal.classList.add('modal-visible');
	};

	const hideModal = () => {
		modal.classList.remove('modal-visible');
	};

	// Event listener delegado para os passos do fluxo
	document.body.addEventListener('click', (e) => {
		const stepBox = e.target.closest('.flow-step-box');
		if (stepBox) {
			// Apenas ativa o modal em telas 'md' (768px) ou menores
			if (window.innerWidth < 768) {
				const title = stepBox.dataset.title;
				const description = stepBox.dataset.description;
				showModal(title, description);
			}
		}
	});

	// Fechar modal
	closeModalBtn.addEventListener('click', hideModal);
	modalOverlay.addEventListener('click', hideModal);
}

// --- NOVO: Função renderFlows (copiada de index.js) ---
/**
 * Renderiza os fluxos como um carrossel de diagramas 2x2.
 * @param {object} flowsConfig - Configuração com título e subtítulo da seção.
 * @param {Array} flows - Array de fluxos, onde cada fluxo tem 4 passos.
 */
function renderFlows(flowsConfig, flows) {
	// Define o título e subtítulo gerais da seção
	setContent('flows-title', flowsConfig?.title || 'Nosso Fluxo');
	setContent(
		'flows-subtitle',
		flowsConfig?.subtitle || 'Processos simples para o seu negócio decolar.'
	);

	const carouselTrack = document.getElementById('carousel-track-flows');
	if (!carouselTrack) return;

	// Garante que 'flows' é um array
	const flowsArray = Array.isArray(flows) ? flows : [];

	if (flowsArray.length === 0) {
		carouselTrack.innerHTML =
			'<p class="text-center w-full">Nenhum fluxo configurado.</p>';
		return;
	}

	carouselTrack.innerHTML = flowsArray
		.map((flow) => {
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

			// Retorna o HTML completo do slide, incluindo o diagrama 2x2
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
	const content = data || {};
	// Hero
	setContent('hero-title', content.hero?.title);
	setContent('hero-subtitle', content.hero?.subtitle);
	setContent('hero-cta-button', content.hero?.cta_button);
	setContent('hero-secondary-button', content.hero?.secondary_button);

	// Value Proposition
	setContent('value-proposition-title', content.valueProposition?.title);
	const vpContainer = document.getElementById('value-proposition-container');
	if (vpContainer)
		vpContainer.innerHTML = (content.valueProposition?.items || [])
			.map(
				(item) => `
		<div class="glass p-6 rounded-2xl">
			<div class="w-12 h-12 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 mb-4">${item.icon}</div>
			<h3 class="font-semibold text-lg">${item.title}</h3>
			<p class="text-white/70 mt-2 text-sm">${item.description}</p>
		</div>`
			)
			.join('');

	// Renderiza a seção 'infoSections'
	const infoSectionsContainer = document.getElementById('info-sections');
	const infoSectionsData = content.infoSections || [];
	if (infoSectionsContainer && Array.isArray(infoSectionsData)) {
		infoSectionsContainer.innerHTML = infoSectionsData
			.map(
				(section) => `
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center reveal">
			<div>
				<h3 class="text-3xl font-bold">${section.title || ''}</h3>
				<p class="mt-4 text-white/80">${section.description || ''}</p>
				<ul class="mt-6 space-y-3">${(section.points || [])
					.map(
						(p) =>
							`<li class="flex items-center gap-3"><svg class="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="text-white/80">${p}</span></li>`
					)
					.join('')}</ul>
			</div>
			<div class="bg-white/5 rounded-2xl p-4">
				<img src="${section.image || ''}" alt="${
					section.title || ''
				}" class="rounded-xl shadow-lg object-cover aspect-video w-full"/>
			</div>
		</div>`
			)
			.join('');
	}

	// Features Grid
	setContent('features-title', content.features?.title);
	setContent('features-subtitle', content.features?.subtitle);
	const featuresContainer = document.getElementById('features-container');
	if (featuresContainer)
		featuresContainer.innerHTML = (content.features?.items || [])
			.map(
				(item) => `
		<div class="flex gap-4">
			<div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">${item.icon}</div>
			<div><h3 class="font-semibold">${item.title}</h3><p class="text-white/70 mt-1 text-sm">${item.description}</p></div>
		</div>`
			)
			.join('');

	// Screenshots
	setContent('screenshots-title', content.screenshots?.title);
	setContent('screenshots-subtitle', content.screenshots?.subtitle);
	const screenshotsContainer = document.getElementById(
		'carousel-track-prints'
	);
	if (screenshotsContainer)
		screenshotsContainer.innerHTML = (content.screenshots?.items || [])
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

	// Testimonials
	setContent('testimonials-title', content.testimonials?.title);
	setContent('testimonials-subtitle', content.testimonials?.subtitle);
	const testimonialsContainer = document.getElementById(
		'carousel-track-testimonials'
	);
	if (testimonialsContainer)
		testimonialsContainer.innerHTML = (content.testimonials?.items || [])
			.map(
				(item) => `
		<div class="carousel-slide-testimonials w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
			<div class="glass p-6 rounded-2xl text-center h-full flex flex-col justify-center">
				<p class="text-white/80">"${item.quote}"</p>
				<div class="mt-4 font-semibold text-orange-400">${item.author}</div>
			</div>
		</div>`
			)
			.join('');

	// For Clients CTA
	setContent('for-clients-tagline', content.forClients?.tagline);
	setContent('for-clients-title', content.forClients?.title);
	setContent('for-clients-description', content.forClients?.description);
	setContent('for-clients-button', content.forClients?.button);

	// Final CTA
	setContent('cta-title', content.cta?.title);
	setContent('cta-description', content.cta?.description);
	setContent('cta-button', content.cta?.button);
}

async function loadContentFromFirebase() {
	try {
		const docSnap = await getDoc(doc(db, 'content', 'pages'));
		const businessPage = docSnap.exists()
			? docSnap.data().businessPage
			: {};

		// Renderiza todo o conteúdo principal
		renderContent(businessPage);
		// Renderiza o NOVO fluxo
		renderFlows(businessPage.flowsConfig, businessPage.flows);
	} catch (error) {
		console.error('Erro ao carregar do Firebase:', error);
		renderContent({});
		renderFlows({}, []); // Renderiza fluxo vazio em caso de erro
	} finally {
		// Inicializa os carrosséis existentes
		initializeCarousel({
			wrapperId: 'carousel-wrapper-prints',
			trackId: 'carousel-track-prints',
			slideClass: '.carousel-slide-prints',
			nextId: 'next-slide-prints',
			prevId: 'prev-slide-prints',
		});
		initializeCarousel({
			wrapperId: 'carousel-wrapper-testimonials',
			trackId: 'carousel-track-testimonials',
			slideClass: '.carousel-slide-testimonials',
			nextId: 'next-slide-testimonials',
			prevId: 'prev-slide-testimonials',
		});
		// Inicializa o NOVO carrossel de fluxo
		initializeCarousel({
			wrapperId: 'carousel-wrapper-flows',
			trackId: 'carousel-track-flows',
			slideClass: '.carousel-slide-flows',
			nextId: 'next-slide-flows',
			prevId: 'prev-slide-flows',
			slidesPerView: 1, // Força 1 slide por vez
		});

		observeRevealElements();
	}
}

function initializeCarousel(config) {
	const {
		wrapperId,
		trackId,
		nextId,
		prevId,
		slidesPerView: configSlides,
	} = config;
	const carouselWrapper = document.getElementById(wrapperId);
	const track = document.getElementById(trackId);
	if (!track || !carouselWrapper) return;

	let originalSlides,
		slides,
		currentIndex,
		slidesPerView,
		isDragging,
		startX,
		startTranslate;
	isDragging = false;

	const setupCarousel = () => {
		originalSlides = Array.from(track.children);
		if (originalSlides.length === 0) return;

		// MODIFICADO: Respeita o 'slidesPerView' do config, se existir
		if (configSlides) {
			slidesPerView = configSlides;
		} else {
			slidesPerView =
				window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
		}

		const nextButton = document.getElementById(nextId);
		const prevButton = document.getElementById(prevId);

		if (originalSlides.length <= slidesPerView) {
			if (nextButton) nextButton.style.display = 'none';
			if (prevButton) prevButton.style.display = 'none';
			// Não clona slides se não for necessário
			track.innerHTML = '';
			originalSlides.forEach((slide) =>
				track.appendChild(slide.cloneNode(true))
			);
			slides = Array.from(track.children);
			currentIndex = 0;
			updatePosition(false);
			return;
		} else {
			if (nextButton) nextButton.style.display = 'block';
			if (prevButton) prevButton.style.display = 'block';
		}

		const fragment = document.createDocumentFragment();
		originalSlides
			.slice(-slidesPerView)
			.forEach((slide) => fragment.appendChild(slide.cloneNode(true)));
		originalSlides.forEach((slide) =>
			fragment.appendChild(slide.cloneNode(true))
		);
		originalSlides
			.slice(0, slidesPerView)
			.forEach((slide) => fragment.appendChild(slide.cloneNode(true)));

		track.innerHTML = '';
		track.appendChild(fragment);

		slides = Array.from(track.children);
		currentIndex = slidesPerView;
		updatePosition(false);
	};

	const updatePosition = (animate = true) => {
		if (!slides || slides.length === 0) return;
		track.style.transition = animate
			? `transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
			: 'none';
		const slideWidth = slides[0]
			? slides[0].getBoundingClientRect().width
			: 0;
		if (slideWidth === 0) return;
		track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
	};

	const handleTransitionEnd = () => {
		if (!originalSlides || originalSlides.length <= slidesPerView) return;
		if (currentIndex < slidesPerView) {
			currentIndex = originalSlides.length + currentIndex;
			updatePosition(false);
		}
		if (currentIndex >= originalSlides.length + slidesPerView) {
			currentIndex = currentIndex - originalSlides.length;
			updatePosition(false);
		}
	};

	const move = (direction) => {
		if (isDragging) return;
		currentIndex += direction;
		updatePosition();
	};

	const handleDragStart = (e) => {
		if (
			!slides ||
			slides.length === 0 ||
			originalSlides.length <= slidesPerView
		)
			return;
		isDragging = true;
		startX = e.pageX || e.touches[0].pageX;
		const slideWidth = slides[0].getBoundingClientRect().width;
		startTranslate = -currentIndex * slideWidth;
		track.style.transition = 'none';
		carouselWrapper.style.cursor = 'grabbing';
	};

	const handleDragMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const currentX = e.pageX || e.touches[0].pageX;
		track.style.transform = `translateX(${
			startTranslate + (currentX - startX)
		}px)`;
	};

	const handleDragEnd = (e) => {
		if (!isDragging) return;
		isDragging = false;
		const currentX =
			e.pageX ||
			(e.changedTouches && e.changedTouches[0].pageX) ||
			startX;
		carouselWrapper.style.cursor = 'grab';

		const slideWidth =
			slides && slides[0] ? slides[0].getBoundingClientRect().width : 0;
		if (slideWidth === 0) {
			updatePosition();
			return;
		}

		if (Math.abs(currentX - startX) > slideWidth / 5) {
			move(currentX > startX ? -1 : 1);
		} else {
			updatePosition();
		}
	};

	const nextButton = document.getElementById(nextId);
	const prevButton = document.getElementById(prevId);
	if (nextButton) nextButton.addEventListener('click', () => move(1));
	if (prevButton) prevButton.addEventListener('click', () => move(-1));

	track.addEventListener('transitionend', handleTransitionEnd);
	carouselWrapper.addEventListener('mousedown', handleDragStart);
	carouselWrapper.addEventListener('mousemove', handleDragMove);
	document.addEventListener('mouseup', handleDragEnd);
	carouselWrapper.addEventListener('mouseleave', (e) => {
		if (isDragging) handleDragEnd(e);
	});
	carouselWrapper.addEventListener('touchstart', handleDragStart, {
		passive: true,
	});
	carouselWrapper.addEventListener('touchmove', handleDragMove, {
		passive: true,
	});
	carouselWrapper.addEventListener('touchend', handleDragEnd);

	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(setupCarousel, 200);
	});

	// Atraso para garantir que o layout esteja estável
	setTimeout(setupCarousel, 500);
}

document.addEventListener('DOMContentLoaded', () => {
	loadContentFromFirebase();

	// UI Setup
	document.getElementById('year').textContent = new Date().getFullYear();
	const mobileMenu = document.getElementById('mobile-menu');
	const mobileBtn = document.getElementById('btn-mobile');
	const closeMenu = () => {
		mobileMenu.classList.remove('open');
		document.body.classList.remove('menu-open');
	};
	mobileBtn.addEventListener('click', () => {
		mobileMenu.classList.toggle('open');
		document.body.classList.toggle('menu-open');
	});
	document
		.querySelectorAll('#mobile-menu a, #nav-desktop a')
		.forEach((link) => link.addEventListener('click', closeMenu));

	// Theme Toggle
	const themeToggle = document.getElementById('theme-toggle');
	const lightIcon = document.getElementById('theme-icon-light');
	const darkIcon = document.getElementById('theme-icon-dark');
	const applyTheme = (theme) => {
		if (theme === 'light') {
			document.body.classList.add('light-theme');
			lightIcon.classList.add('hidden');
			darkIcon.classList.remove('hidden');
		} else {
			document.body.classList.remove('light-theme');
			lightIcon.classList.remove('hidden');
			darkIcon.classList.add('hidden');
		}
	};
	const savedTheme = localStorage.getItem('theme') || 'dark';
	applyTheme(savedTheme);
	themeToggle.addEventListener('click', () => {
		const newTheme = document.body.classList.toggle('light-theme')
			? 'light'
			: 'dark';
		localStorage.setItem('theme', newTheme);
		applyTheme(newTheme);
	});

	observeRevealElements();

	// Configura o modal de fluxo
	setupFlowModal();
});
