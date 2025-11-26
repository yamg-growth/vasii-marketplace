import { Product } from '@/types/product';
import { classifyProductCollection, isProductPlusSize } from '@/utils/productClassifier';

/**
 * Mock product data based on the Excel inventory
 * In a real implementation, this would be replaced with data loaded from the Excel file
 */
export const MOCK_PRODUCTS: Product[] = [
  // Sample products from different categories
  {
    id: '15501',
    code: '15501',
    category: 'WOMEN',
    subcategory: 'Vestidos',
    size: 'L',
    fabric: '5%Viscose & 4%Polyester & 91%Cotton',
    price: 109000,
    imageUrl: 'http://img.ltwebstatic.com/images3_pi/2022/05/26/1653533789cfdd96a3a283da9d3aa5e59f5a6326e4_thumbnail_405x552.jpg',
    box: 'Vestidos 13',
    stock: 1,
    collection: 'glamour-fiesta',
    isPlus: false
  },
  {
    id: '15502',
    code: '15502',
    category: 'WOMEN',
    subcategory: 'Vestidos',
    size: 'M',
    fabric: '69%Cotton & 15%Polyester & 13%Viscose & 3%Modal',
    price: 109000,
    imageUrl: 'http://img.ltwebstatic.com/images3_pi/2023/10/26/d4/1698291816b36fac1adb21ab3608720a35d8a2c75c_thumbnail_405x552.jpg',
    box: 'Vestidos 12',
    stock: 1,
    collection: 'glamour-fiesta',
    isPlus: false
  }
];

/**
 * This function would parse the Excel file and return all products
 * For now, it returns mock data
 */
export async function loadProductsFromExcel(): Promise<Product[]> {
  // TODO: Implement Excel parsing logic
  // This would use a library like xlsx or exceljs to read the uploaded Excel file
  // For now, return mock data
  return MOCK_PRODUCTS;
}

/**
 * Get products by collection
 */
export function getProductsByCollection(products: Product[], collection: string) {
  return products.filter(p => p.collection === collection);
}

/**
 * Get unique categories from products
 */
export function getUniqueCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.category)));
}

/**
 * Get unique subcategories from products
 */
export function getUniqueSubcategories(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.subcategory)));
}

/**
 * Get unique sizes from products
 */
export function getUniqueSizes(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.size))).sort();
}

/**
 * Get price range from products
 */
export function getPriceRange(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 0];
  
  const prices = products.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}
