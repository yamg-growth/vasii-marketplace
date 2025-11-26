import { Collection } from '@/types/product';

/**
 * Classifies products into collections based on category, subcategory, and keywords
 */
export function classifyProductCollection(
  category: string,
  subcategory: string,
  box: string
): Collection {
  const lowerCategory = category.toLowerCase();
  const lowerSubcategory = subcategory.toLowerCase();
  const lowerBox = box.toLowerCase();
  
  // Correct TENIS -> TEENS
  if (lowerCategory.includes('tenis') || lowerBox.includes('tenis')) {
    return 'el-bazar';
  }
  
  // GLAMOUR & FIESTA - Dresses and two-pieces
  if (
    lowerBox.includes('vestido') ||
    lowerBox.includes('cocktail') ||
    lowerSubcategory.includes('dress') ||
    lowerBox.includes('dos piezas') ||
    lowerBox.includes('two piece')
  ) {
    // Check if it's plus size
    if (
      lowerSubcategory.includes('plus') ||
      lowerBox.includes('plus')
    ) {
      return 'curvy-edition';
    }
    return 'glamour-fiesta';
  }
  
  // CURVY EDITION - All plus size items
  if (
    lowerSubcategory.includes('plus') ||
    lowerBox.includes('plus') ||
    lowerCategory.includes('plus')
  ) {
    return 'curvy-edition';
  }
  
  // WORK & CASUAL - Blusas, cardigans, jeans, camisetas
  if (
    lowerBox.includes('blusa') ||
    lowerBox.includes('cardigan') ||
    lowerBox.includes('jean') ||
    lowerBox.includes('camiseta') ||
    lowerBox.includes('top') ||
    lowerSubcategory.includes('blouse') ||
    lowerSubcategory.includes('cardigan') ||
    lowerSubcategory.includes('sweater') ||
    lowerSubcategory.includes('jeans') ||
    lowerSubcategory.includes('t-shirt') ||
    lowerSubcategory.includes('shirt')
  ) {
    return 'work-casual';
  }
  
  // WINTER - Coats, Jackets, Abrigos
  if (
    lowerBox.includes('coat') ||
    lowerBox.includes('jacket') ||
    lowerBox.includes('abrigo') ||
    lowerSubcategory.includes('coat') ||
    lowerSubcategory.includes('jacket') ||
    lowerSubcategory.includes('outerwear')
  ) {
    return 'winter';
  }
  
  // EL BAZAR - Men, Baby, Maternity, Sport, Teens
  if (
    lowerCategory.includes('men') ||
    lowerCategory.includes('baby') ||
    lowerCategory.includes('maternity') ||
    lowerCategory.includes('kids') ||
    lowerCategory.includes('teens') ||
    lowerSubcategory.includes('sport') ||
    lowerBox.includes('sport') ||
    lowerBox.includes('teens')
  ) {
    return 'el-bazar';
  }
  
  // Default fallback
  return 'el-bazar';
}

/**
 * Checks if a product is plus size
 */
export function isProductPlusSize(
  category: string,
  subcategory: string,
  box: string
): boolean {
  const lowerCategory = category.toLowerCase();
  const lowerSubcategory = subcategory.toLowerCase();
  const lowerBox = box.toLowerCase();
  
  return (
    lowerSubcategory.includes('plus') ||
    lowerBox.includes('plus') ||
    lowerCategory.includes('plus')
  );
}

/**
 * Parses price from string format (e.g., "$ 109,000" -> 109000)
 */
export function parsePrice(priceString: string): number {
  if (!priceString) return 0;
  
  // Remove currency symbols and spaces
  const cleaned = priceString.replace(/[$€\s]/g, '');
  
  // Remove dots used as thousands separators and replace comma with dot
  const normalized = cleaned.replace(/\./g, '').replace(/,/g, '');
  
  return parseFloat(normalized) || 0;
}

/**
 * Formats price to display format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}
