import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { loadAllProducts } from '@/data/loadProducts';

/**
 * Hook to load products from Supabase
 * Handles loading state and caching
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await loadAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadProducts();
  };

  return { products, loading, error, refetch };
}
