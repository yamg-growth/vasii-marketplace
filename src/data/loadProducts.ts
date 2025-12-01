import { Product } from '@/types/product';
import { parseInventoryFile } from '@/utils/productParser';

// Import the inventory file content
import womenInventoryText from './women-inventory.txt?raw';

let cachedProducts: Product[] | null = null;

/**
 * Loads all products from inventory files
 * This function caches the parsed products for performance
 * Priority: localStorage (uploaded CSV) > fallback to women-inventory.txt
 */
export function loadAllProducts(): Product[] {
  // Check if there are products in localStorage from CSV upload
  const storedProducts = localStorage.getItem('vasii-products');
  if (storedProducts) {
    try {
      const products = JSON.parse(storedProducts) as Product[];
      // Filter out INBOX products (only show classified products in public view)
      const classifiedProducts = products.filter(p => p.collection !== 'inbox');
      console.log(`Loaded ${classifiedProducts.length} classified products from uploaded CSV`);
      return classifiedProducts;
    } catch (error) {
      console.error('Error parsing stored products:', error);
    }
  }

  // Fallback to cached products
  if (cachedProducts) {
    return cachedProducts;
  }

  const products: Product[] = [];

  // Parse women inventory as fallback
  if (womenInventoryText) {
    const womenProducts = parseInventoryFile(womenInventoryText);
    products.push(...womenProducts);
  }

  // Cache the results
  cachedProducts = products;
  
  console.log(`Loaded ${products.length} products from fallback inventory`);
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
