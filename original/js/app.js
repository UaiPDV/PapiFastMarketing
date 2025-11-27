import { loadContentFromFirebase } from './index.js';

// --- Funções de UI ---

/**
 * Configura todos os ouvintes de eventos da UI (menu, tema, scroll, etc).
 */
function setupUI() {
	// Menu mobile
	const mobileMenu = document.getElementById('mobile-menu');
	const mobileBtn = document.getElementById('btn-mobile');
	const closeMenu = () => {
		if (mobileMenu) mobileMenu.classList.remove('open');
		document.body.classList.remove('menu-open');
	};
	if (mobileBtn) {
		mobileBtn.addEventListener('click', () => {
			if (mobileMenu) mobileMenu.classList.toggle('open');
			document.body.classList.toggle('menu-open');
		});
	}
	document
		.querySelectorAll('#mobile-menu a, #nav-desktop a')
		.forEach((link) => link.addEventListener('click', closeMenu));

	// Ano no footer
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}

	// Alternador de tema
	const themeToggle = document.getElementById('theme-toggle');
	const lightIcon = document.getElementById('theme-icon-light');
	const darkIcon = document.getElementById('theme-icon-dark');
	const applyTheme = (theme) => {
		if (theme === 'light') {
			document.body.classList.add('light-theme');
			if (lightIcon) lightIcon.classList.add('hidden');
			if (darkIcon) darkIcon.classList.remove('hidden');
		} else {
			document.body.classList.remove('light-theme');
			if (lightIcon) lightIcon.classList.remove('hidden');
			if (darkIcon) darkIcon.classList.add('hidden');
		}
	};
	const savedTheme = localStorage.getItem('theme') || 'dark';
	applyTheme(savedTheme);
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const newTheme = document.body.classList.toggle('light-theme')
				? 'light'
				: 'dark';
			localStorage.setItem('theme', newTheme);
			applyTheme(newTheme);
		});
	}

	// Animação de scroll
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) entry.target.classList.add('visible');
			});
		},
		{ threshold: 0.1 }
	);
	document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

	// Lógica das Abas (Tabs)
	const tabsContainer = document.getElementById('tabs-container');
	if (tabsContainer) {
		tabsContainer.addEventListener('click', (e) => {
			if (!e.target.matches('.tab-btn')) return;
			const tabId = e.target.dataset.tab;

			tabsContainer
				.querySelectorAll('.tab-btn')
				.forEach((btn) => btn.classList.remove('active'));
			e.target.classList.add('active');

			document
				.querySelectorAll('#tabs-content-container .tab-content')
				.forEach((content) => {
					content.classList.remove('active');
				});
			const tabContent = document.getElementById(tabId);
			if (tabContent) {
				tabContent.classList.add('active');
			}
		});
	}

	// Inicializa Carrosséis
	initializeCarousel({
		wrapperId: 'carousel-wrapper-prints',
		trackId: 'carousel-track-prints',
		slideClass: '.carousel-slide-prints',
		nextId: 'next-slide-prints',
		prevId: 'prev-slide-prints',
	});
	initializeCarousel({
		wrapperId: 'carousel-wrapper',
		trackId: 'carousel-track',
		slideClass: '.carousel-slide',
		nextId: 'next-slide',
		prevId: 'prev-slide',
	});
	// CARROSSEL DE FLUXO (MODIFICADO)
	initializeCarousel({
		wrapperId: 'carousel-wrapper-flows',
		trackId: 'carousel-track-flows',
		slideClass: '.carousel-slide-flows',
		nextId: 'next-slide-flows',
		prevId: 'prev-slide-flows',
		slidesPerView: 1, // Força 1 slide por vez, independente da tela
	});

	// NOVO: Configura o modal do fluxo
	setupFlowModal();
}

/**
 * Inicializa um carrossel com loop infinito e drag.
 * @param {object} config - Configuração (IDs e classes) do carrossel.
 */
function initializeCarousel(config) {
	const carouselWrapper = document.getElementById(config.wrapperId);
	const track = document.getElementById(config.trackId);
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
		if (config.slidesPerView) {
			slidesPerView = config.slidesPerView;
		} else {
			slidesPerView =
				window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
		}

		const nextButton = document.getElementById(config.nextId);
		const prevButton = document.getElementById(config.prevId);

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

	const nextButton = document.getElementById(config.nextId);
	const prevButton = document.getElementById(config.prevId);
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

	setTimeout(setupCarousel, 500);
}

// --- NOVO: Lógica do Modal do Fluxo ---
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

// --- Ponto de Entrada da Aplicação ---

document.addEventListener('DOMContentLoaded', async () => {
	// 1. Carrega o conteúdo dinâmico primeiro
	await loadContentFromFirebase();
	// 2. Depois que o conteúdo está na página, configura a UI
	setupUI();
});
