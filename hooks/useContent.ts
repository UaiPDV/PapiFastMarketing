import { useEffect, useState } from 'react';
import { defaultContent } from '../utils/defaults';

export const useContent = () => {
	const [content, setContent] = useState<any>(defaultContent);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchContent = async () => {
		try {
			setLoading(true);
			// Primeiro tenta carregar um arquivo estático gerado em build: /content.json
			try {
				const resp = await fetch('/content.json', {
					cache: 'no-cache',
				});
				if (resp.ok) {
					const json = await resp.json();
					// Mesclar com defaults para garantir estrutura mínima
					setContent({
						homePage: {
							...defaultContent.homePage,
							...(json.homePage || {}),
						},
						businessPage: {
							...defaultContent.businessPage,
							...(json.businessPage || {}),
						},
					});
					setLoading(false);
					return;
				}
			} catch (e) {
				// Falha ao carregar content.json: continua para buscar no Firestore
			}

			// Tentativa 1: Buscar documentos separados (Nova estrutura)
			// Buscamos home e business em paralelo usando import dinâmico para evitar bundlar o cliente Firebase
			try {
				const firestore = await import('firebase/firestore');
				const firebaseMod: any = await import('../firebase');
				const homeRef = firestore.doc(
					firebaseMod.db,
					'content',
					'home'
				);
				const businessRef = firestore.doc(
					firebaseMod.db,
					'content',
					'business'
				);

				const [homeSnap, businessSnap] = await Promise.all([
					firestore.getDoc(homeRef),
					firestore.getDoc(businessRef),
				]);

				if (homeSnap.exists() && businessSnap.exists()) {
					const homeData = homeSnap.data();
					const businessData = businessSnap.data();

					setContent({
						homePage: { ...defaultContent.homePage, ...homeData },
						businessPage: {
							...defaultContent.businessPage,
							...businessData,
						},
					});
					return;
				}

				// Tentativa 2: legacy
				const legacyRef = firestore.doc(
					firebaseMod.db,
					'content',
					'pages'
				);
				const legacySnap = await firestore.getDoc(legacyRef);
				if (legacySnap.exists()) {
					const data = legacySnap.data();
					setContent({
						homePage: {
							...defaultContent.homePage,
							...(data.homePage || {}),
						},
						businessPage: {
							...defaultContent.businessPage,
							...(data.businessPage || {}),
						},
					});
					return;
				}
			} catch (fireErr) {
				// Se houver erro ao carregar Firestore dinamicamente, deixamos o fallback mais abaixo
				console.warn(
					'Firestore dinâmico não disponível:',
					fireErr?.message || fireErr
				);
			}
		} catch (err: any) {
			console.error('Erro ao carregar conteúdo:', err);
			setError(err.message);
			// Fallback para conteúdo padrão em caso de erro crítico
			setContent(defaultContent);
		} finally {
			setLoading(false);
		}
	};

	const saveContent = async (newContent: any) => {
		try {
			setLoading(true);

			// Separar os dados para salvar em documentos diferentes
			// Isso evita o limite de 1MB do Firestore por documento
			const homeData = newContent.homePage;
			const businessData = newContent.businessPage;

			// Salvamento Sequencial (Uma coisa de cada vez, como solicitado)
			// 1. Salva a Home Page e 2. Salva a Business Page usando import dinâmico
			const firestore = await import('firebase/firestore');
			const firebaseMod: any = await import('../firebase');
			await firestore.setDoc(
				firestore.doc(firebaseMod.db, 'content', 'home'),
				homeData
			);
			await firestore.setDoc(
				firestore.doc(firebaseMod.db, 'content', 'business'),
				businessData
			);

			// Atualiza o estado local
			setContent(newContent);
		} catch (err: any) {
			console.error('Erro ao salvar:', err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchContent();
	}, []);

	return { content, loading, error, saveContent, refetch: fetchContent };
};
