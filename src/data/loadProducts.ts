import { Product, Collection } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

let cachedProducts: Product[] | null = null;

/**
 * Loads all products from Supabase
 * Falls back to cached products if Supabase fails
 * Filters out INBOX products (only show classified products in public view)
 */
export async function loadAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('collection', 'inbox')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map Supabase data to Product format
    const products: Product[] = (data || []).map(item => ({
      id: item.id,
      code: item.id,
      barCode: item.id,
      category: item.category,
      subcategory: item.subcategory,
      size: item.variant,
      fabric: item.fabric || 'N/A',
      price: item.price,
      imageUrl: item.image_url,
      box: item.subcategory,
      stock: 1,
      collection: item.collection as Collection,
      isPlus: /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(item.variant)
    }));

    // Cache the results
    cachedProducts = products;
    
    console.log(`Loaded ${products.length} classified products from Supabase`);
    return products;
  } catch (error) {
    console.error('Error loading products from Supabase:', error);
    
    // Fallback to cached products if available
    if (cachedProducts) {
      console.log('Using cached products');
      return cachedProducts;
    }
    
    return [];
  }
}

/**
 * Synchronous version that returns cached products immediately
 * Use this for components that can't handle async
 */
export function loadAllProductsSync(): Product[] {
  return cachedProducts || [];
}

/**
 * Get products by collection
 */
export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  return allProducts.filter(p => p.collection === collection);
}

/**
 * Synchronous version for immediate access
 */
export function getProductsByCollectionSync(collection: string): Product[] {
  return loadAllProductsSync().filter(p => p.collection === collection);
}

/**
 * Get unique categories from products
 */
export function getUniqueCategories(): string[] {
  const allProducts = loadAllProductsSync();
  return Array.from(new Set(allProducts.map(p => p.category)));
}

/**
 * Get unique subcategories from products
 */
export function getUniqueSubcategories(): string[] {
  const allProducts = loadAllProductsSync();
  return Array.from(new Set(allProducts.map(p => p.subcategory)));
}

/**
 * Get unique sizes from products
 */
export function getUniqueSizes(): string[] {
  const allProducts = loadAllProductsSync();
  return Array.from(new Set(allProducts.map(p => p.size))).sort();
}

/**
 * Get price range from products
 */
export function getPriceRange(): [number, number] {
  const allProducts = loadAllProductsSync();
  if (allProducts.length === 0) return [0, 0];
  
  const prices = allProducts.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}
