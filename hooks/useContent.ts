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
      const docRef = doc(db, 'content', 'pages');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Merge with default to ensure structure exists even if partial data
        const mergedContent = {
            homePage: { ...defaultContent.homePage, ...data.homePage },
            businessPage: { ...defaultContent.businessPage, ...data.businessPage }
        };
        setContent(mergedContent);
      } else {
        // Init DB if empty
        await setDoc(docRef, defaultContent);
        setContent(defaultContent);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      // Fallback to default content on error
      setContent(defaultContent); 
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (newContent: any) => {
    try {
      setLoading(true);
      await setDoc(doc(db, 'content', 'pages'), newContent);
      setContent(newContent);
    } catch (err: any) {
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