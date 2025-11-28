import { Collection } from '@/types/product';

/**
 * Classifies products into collections based on category, subcategory, and keywords
 */
export function classifyProductCollection(
  category: string,
  subcategory: string,
  box: string
): Collection {
  const categoryLower = category.toLowerCase();
  const subcategoryLower = subcategory.toLowerCase();
  const boxLower = box.toLowerCase();

  // Fix TENIS -> TEENS
  if (categoryLower.includes('tenis') || boxLower.includes('tenis')) {
    return 'el-bazar';
  }

  // EL BAZAR: Men, Baby/Maternity, Sport, Teens
  if (
    categoryLower.includes('men') ||
    categoryLower.includes('baby') ||
    categoryLower.includes('maternity') ||
    categoryLower.includes('teens') ||
    categoryLower.includes('sport') ||
    subcategoryLower.includes('sport')
  ) {
    return 'el-bazar';
  }

  // Check if it's plus size first
  const isPlusSize = isProductPlusSize(category, subcategory, box);

  // GLAMOUR & FIESTA: Dresses, jumpsuits, two-pieces (non-plus)
  if (
    subcategoryLower.includes('vestido') ||
    subcategoryLower.includes('dress') ||
    subcategoryLower.includes('dos piezas') ||
    subcategoryLower.includes('two piece') ||
    subcategoryLower.includes('cocktail') ||
    subcategoryLower.includes('jumpsuit') ||
    subcategoryLower.includes('mono') ||
    boxLower.includes('vestido') ||
    boxLower.includes('cocktail') ||
    boxLower.includes('dos piezas')
  ) {
    return isPlusSize ? 'curvy-edition' : 'glamour-fiesta';
  }

  // CURVY EDITION: All plus size items
  if (isPlusSize) {
    return 'curvy-edition';
  }

  // WINTER: Coats, Jackets, Sweaters, Cardigans, Abrigos
  if (
    subcategoryLower.includes('coat') ||
    subcategoryLower.includes('jacket') ||
    subcategoryLower.includes('sweater') ||
    subcategoryLower.includes('cardigan') ||
    subcategoryLower.includes('abrigo') ||
    boxLower.includes('coat') ||
    boxLower.includes('jacket') ||
    boxLower.includes('sweater') ||
    boxLower.includes('cardigan')
  ) {
    return 'winter';
  }

  // WORK & CASUAL: Blusas, Jeans, Camisetas, Tops, Blazers, Pantalones, etc.
  if (
    subcategoryLower.includes('blusa') ||
    subcategoryLower.includes('jean') ||
    subcategoryLower.includes('camiseta') ||
    subcategoryLower.includes('top') ||
    subcategoryLower.includes('blazer') ||
    subcategoryLower.includes('falda') ||
    subcategoryLower.includes('skirt') ||
    subcategoryLower.includes('pantalon') ||
    subcategoryLower.includes('pant') ||
    subcategoryLower.includes('short') ||
    subcategoryLower.includes('legging') ||
    subcategoryLower.includes('lingerie') ||
    subcategoryLower.includes('bikini') ||
    subcategoryLower.includes('pijama') ||
    boxLower.includes('blusa') ||
    boxLower.includes('jean') ||
    boxLower.includes('camiseta')
  ) {
    return 'work-casual';
  }

  // Default to work-casual for women's items
  if (categoryLower.includes('women')) {
    return 'work-casual';
  }

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
