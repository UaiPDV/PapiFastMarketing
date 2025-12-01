import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultContent } from '../utils/defaults';

export const useContent = () => {
  const [content, setContent] = useState<any>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Tentativa 1: Buscar documentos separados (Nova estrutura)
      // Buscamos home e business em paralelo
      const [homeSnap, businessSnap] = await Promise.all([
        getDoc(doc(db, 'content', 'home')),
        getDoc(doc(db, 'content', 'business'))
      ]);

      if (homeSnap.exists() && businessSnap.exists()) {
        // Se a nova estrutura existe, usamos ela
        const homeData = homeSnap.data();
        const businessData = businessSnap.data();

        setContent({
          homePage: { ...defaultContent.homePage, ...homeData },
          businessPage: { ...defaultContent.businessPage, ...businessData }
        });
      } else {
        // Tentativa 2: Buscar documento legado (Antiga estrutura)
        const legacyRef = doc(db, 'content', 'pages');
        const legacySnap = await getDoc(legacyRef);

        if (legacySnap.exists()) {
          const data = legacySnap.data();
          // Mesclar com defaults para garantir estrutura
          const mergedContent = {
              homePage: { ...defaultContent.homePage, ...data.homePage },
              businessPage: { ...defaultContent.businessPage, ...data.businessPage }
          };
          setContent(mergedContent);
        } else {
          // Se nada existir, usa o padrão e salva a estrutura inicial separada
          await saveContent(defaultContent);
          setContent(defaultContent);
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar conteúdo:", err);
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
      // 1. Salva a Home Page
      await setDoc(doc(db, 'content', 'home'), homeData);
      
      // 2. Salva a Business Page
      await setDoc(doc(db, 'content', 'business'), businessData);

      // Atualiza o estado local
      setContent(newContent);
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
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