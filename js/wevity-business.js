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
				(section, index) => `
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

// Renderizar Fluxos (Business)
function renderBusinessFlows(flows, flowsConfig = {}) {
	if (!flows || flows.length === 0) return;

	setContent(
		'business-flows-title',
		flowsConfig.title || 'Fluxos de Trabalho'
	);
	setContent(
		'business-flows-subtitle',
		flowsConfig.subtitle || 'Processos simplificados para o seu negócio'
	);

	const track = document.getElementById('business-flows-carousel-track');
	const indicators = document.getElementById('business-flows-indicators');

	// Função para calcular posições dos círculos em formato circular (sempre)
	function getGeometricPositions(numSteps, containerSize) {
		const positions = [];
		const centerX = containerSize.width / 2;
		const centerY = containerSize.height / 2;

		// Ajusta o raio baseado no número de itens para melhor espaçamento
		let radius = 180;
		if (numSteps === 2) radius = 120;
		if (numSteps === 3) radius = 140;
		if (numSteps === 4) radius = 160;

		// Sempre em círculo, começando do topo (12 horas)
		for (let i = 0; i < numSteps; i++) {
			const angle = (i * 2 * Math.PI) / numSteps - Math.PI / 2;
			positions.push({
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle),
			});
		}

		return positions;
	}

	// Função para calcular ângulo e distância entre dois pontos
	function getConnection(from, to) {
		const circleRadius = 70; // Raio do círculo (140px de diâmetro / 2)

		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const angle = Math.atan2(dy, dx) * (180 / Math.PI);
		const totalDistance = Math.sqrt(dx * dx + dy * dy);

		// Distância da seta = distância total - raios dos dois círculos
		const arrowDistance = totalDistance - circleRadius * 2;

		// Ponto de início da seta (na borda do círculo de origem)
		const startOffsetX = circleRadius * Math.cos((angle * Math.PI) / 180);
		const startOffsetY = circleRadius * Math.sin((angle * Math.PI) / 180);

		return {
			angle,
			distance: arrowDistance,
			startX: startOffsetX,
			startY: startOffsetY,
		};
	}

	track.innerHTML = flows
		.map((flow, flowIndex) => {
			const steps = flow.steps || [];

			// Tamanho fixo do container para centralização
			const containerWidth = 700;
			const containerHeight = 600;

			const positions = getGeometricPositions(steps.length, {
				width: containerWidth,
				height: containerHeight,
			});

			return `
		<div class="flow-container" style="display: flex; justify-content: center; align-items: center; width: 100%; min-height: 600px;">
			<div style="position: relative; width: ${containerWidth}px; height: ${containerHeight}px;">
				${steps
					.map((step, stepIndex) => {
						const pos = positions[stepIndex];
						const nextPos =
							positions[(stepIndex + 1) % steps.length];
						const connection = getConnection(pos, nextPos);

						return `
					<div class="flow-step" style="position: absolute; left: ${pos.x}px; top: ${
							pos.y
						}px; transform: translate(-50%, -50%); animation: fadeInUp 0.6s ease-out ${
							stepIndex * 0.1
						}s both; z-index: 2;">
						<div class="flow-circle">
							<!-- Número do passo -->
							<div style="position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #ef4444); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${
								stepIndex + 1
							}</div>
							<div class="flow-icon">${step.icon || '📱'}</div>
							<div style="font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.9);">${
								step.title || ''
							}</div>
						</div>
						<div class="flow-label" style="max-width: 140px; text-align: center;">${
							step.label || ''
						}</div>
						
						<!-- Linha conectando ao próximo círculo -->
						<div style="
							position: absolute;
							left: 50%;
							top: 50%;
							margin-left: ${connection.startX}px;
							margin-top: ${connection.startY}px;
							width: ${connection.distance}px;
							height: 2px;
							background: rgba(251, 146, 60, 0.7);
							transform-origin: left center;
							transform: rotate(${connection.angle}deg);
							z-index: 1;
						"></div>
					</div>
				`;
					})
					.join('')}
			</div>
		</div>
	`;
		})
		.join('');

	// Indicadores
	if (flows.length > 1) {
		indicators.innerHTML = flows
			.map(
				(_, index) =>
					`<div class="flow-indicator ${
						index === 0 ? 'active' : ''
					}" data-index="${index}"></div>`
			)
			.join('');
		document
			.getElementById('business-flows-prev')
			.classList.remove('hidden');
		document
			.getElementById('business-flows-next')
			.classList.remove('hidden');
	} else {
		indicators.innerHTML = '';
		document.getElementById('business-flows-prev').classList.add('hidden');
		document.getElementById('business-flows-next').classList.add('hidden');
	}

	// Inicializar carrossel de fluxos
	if (flows.length > 1) initBusinessFlowsCarousel(flows.length);
}

function initBusinessFlowsCarousel(totalFlows) {
	let currentFlow = 0;
	const track = document.getElementById('business-flows-carousel-track');
	const indicators = document.querySelectorAll(
		'#business-flows-indicators .flow-indicator'
	);
	const prevBtn = document.getElementById('business-flows-prev');
	const nextBtn = document.getElementById('business-flows-next');

	function updateCarousel() {
		track.style.transform = `translateX(-${currentFlow * 100}%)`;
		indicators.forEach((ind, idx) => {
			ind.classList.toggle('active', idx === currentFlow);
		});
	}

	function next() {
		currentFlow = (currentFlow + 1) % totalFlows;
		updateCarousel();
	}

	function prev() {
		currentFlow = (currentFlow - 1 + totalFlows) % totalFlows;
		updateCarousel();
	}

	nextBtn.addEventListener('click', next);
	prevBtn.addEventListener('click', prev);
	indicators.forEach((ind, idx) => {
		ind.addEventListener('click', () => {
			currentFlow = idx;
			updateCarousel();
		});
	});

	// Auto-play opcional (a cada 8 segundos)
	setInterval(next, 8000);
}

async function loadContentFromFirebase() {
	try {
		const docSnap = await getDoc(doc(db, 'content', 'pages'));
		const businessPage = docSnap.exists()
			? docSnap.data().businessPage
			: {};
		renderContent(businessPage);
		renderBusinessFlows(
			businessPage.flows || [],
			businessPage.flowsConfig || {}
		);
	} catch (error) {
		console.error('Erro ao carregar do Firebase:', error);
		renderContent({});
	} finally {
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
		observeRevealElements();
	}
}

function initializeCarousel(config) {
	const { wrapperId, trackId, slideClass, nextId, prevId } = config;
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

		slidesPerView =
			window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
		const nextButton = document.getElementById(nextId);
		const prevButton = document.getElementById(prevId);

		if (originalSlides.length <= slidesPerView) {
			if (nextButton) nextButton.style.display = 'none';
			if (prevButton) prevButton.style.display = 'none';
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
		const slideWidth = slides[0].getBoundingClientRect().width;
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
		if (
			Math.abs(currentX - startX) >
			slides[0].getBoundingClientRect().width / 5
		) {
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

	setupCarousel();
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
});
