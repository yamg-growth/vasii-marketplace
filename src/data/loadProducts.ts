import { Product } from '@/types/product';
import { parseInventoryFile } from '@/utils/productParser';

// Import the inventory file content
import womenInventoryText from './women-inventory.txt?raw';

let cachedProducts: Product[] | null = null;

/**
 * Loads all products from inventory files
 * This function caches the parsed products for performance
 */
export function loadAllProducts(): Product[] {
  if (cachedProducts) {
    return cachedProducts;
  }

  const products: Product[] = [];

  // Parse women inventory
  if (womenInventoryText) {
    const womenProducts = parseInventoryFile(womenInventoryText);
    products.push(...womenProducts);
  }

  // Cache the results
  cachedProducts = products;
  
  console.log(`Loaded ${products.length} products from inventory`);
  return products;
}

/**
 * Get products by collection
 */
export function getProductsByCollection(collection: string): Product[] {
  const allProducts = loadAllProducts();
  return allProducts.filter(p => p.collection === collection);
}

/**
 * Get unique categories from products
 */
export function getUniqueCategories(): string[] {
  const allProducts = loadAllProducts();
  return Array.from(new Set(allProducts.map(p => p.category)));
}

/**
 * Get unique subcategories from products
 */
export function getUniqueSubcategories(): string[] {
  const allProducts = loadAllProducts();
  return Array.from(new Set(allProducts.map(p => p.subcategory)));
}

/**
 * Get unique sizes from products
 */
export function getUniqueSizes(): string[] {
  const allProducts = loadAllProducts();
  return Array.from(new Set(allProducts.map(p => p.size))).sort();
}

/**
 * Get price range from products
 */
export function getPriceRange(): [number, number] {
  const allProducts = loadAllProducts();
  if (allProducts.length === 0) return [0, 0];
  
  const prices = allProducts.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}
