import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

/**
 * Loads all products from Supabase
 * Only returns products that have been classified (collection is not null)
 */
export async function loadAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('collection', 'is', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map Supabase schema to Product type
    const products: Product[] = (data || []).map(row => ({
      id: row.id.toString(),
      code: row.id.toString(),
      category: row.category || '',
      subcategory: row.subcategory || '',
      size: row.size || '',
      fabric: row.details || '',
      price: row.price || 0,
      imageUrl: row.image_url || '/placeholder.svg',
      box: row.subcategory || row.category || '',
      stock: 1,
      collection: row.collection as any,
      isPlus: /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(row.size || '')
    }));
    
    console.log(`Loaded ${products.length} classified products from Supabase`);
    return products;
  } catch (error) {
    console.error('Error loading products from Supabase:', error);
    return [];
  }
}

/**
 * Get products by collection
 */
export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  return allProducts.filter(p => p.collection === collection);
}

/**
 * Get unique categories from products
 */
export async function getUniqueCategories(): Promise<string[]> {
  const allProducts = await loadAllProducts();
  return Array.from(new Set(allProducts.map(p => p.category)));
}

/**
 * Get unique subcategories from products
 */
export async function getUniqueSubcategories(): Promise<string[]> {
  const allProducts = await loadAllProducts();
  return Array.from(new Set(allProducts.map(p => p.subcategory)));
}

/**
 * Get unique sizes from products
 */
export async function getUniqueSizes(): Promise<string[]> {
  const allProducts = await loadAllProducts();
  return Array.from(new Set(allProducts.map(p => p.size))).sort();
}

/**
 * Get price range from products
 */
export async function getPriceRange(): Promise<[number, number]> {
  const allProducts = await loadAllProducts();
  if (allProducts.length === 0) return [0, 0];
  
  const prices = allProducts.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}
