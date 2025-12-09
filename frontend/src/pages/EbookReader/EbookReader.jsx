import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiArrowLeft } from 'react-icons/fi';
import { getEbook } from '@/utils/offlineStorage';
import PDFReader from '@/components/ebook/PDFReader';
import Button from '@/components/ui/Button';

export default function EbookReader() {
  const [searchParams] = useSearchParams();
  const ebookId = searchParams.get('id');
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEbook = async () => {
      if (!ebookId) return;

      try {
        const ebookData = await getEbook(ebookId);
        setEbook(ebookData);
      } catch (error) {
        console.error('Error loading ebook:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEbook();
  }, [ebookId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-900">Chargement de l'ebook...</p>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <FiBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ebook non trouvé</h2>
          <p className="text-gray-600 mb-4">L'ebook demandé n'est pas disponible.</p>
          <Button onClick={() => window.history.back()}>
            <FiArrowLeft className="mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return <PDFReader blob={ebook.blob} onClose={() => window.history.back()} />;
}