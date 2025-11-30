import { Product, Collection } from '@/types/product';

export interface CSVRow {
  ID: string;
  CATEGORY: string;
  SUBCATEGORY: string;
  VARIANT: string; // Size/Talla
  FABRIC: string;
  PRICE: string;
  IMAGE_URL: string;
}

/**
 * Parses a TAB-SEPARATED line into a product object
 * Format: ID \t CATEGORY \t SUBCATEGORY \t VARIANT \t FABRIC \t PRICE \t IMAGE_URL
 * Columns: [0] ID, [1] CATEGORY, [2] SUBCATEGORY, [3] VARIANT (Talla), [4] FABRIC, [5] PRICE, [6] IMAGE_URL
 */
export function parseCSVLine(line: string, lineNumber: number): Partial<Product> | null {
  if (!line.trim()) return null;
  
  // Ignorar líneas que no empiecen con número (headers como "WOMEN", etc.)
  if (!/^\d/.test(line.trim())) return null;
  
  try {
    // Split por tabulación
    const columns = line.split('\t').map(col => col.trim());
    
    if (columns.length < 7) return null;
    
    const [id, category, subcategory, variant, fabric, priceRaw, imageUrlRaw] = columns;
    
    if (!id || !category) return null;
    
    // Limpiar precio: "$ 109,000" -> 109000
    const priceStr = priceRaw.replace(/[$\s]/g, '').replace(/,/g, '');
    const price = parseInt(priceStr) || 0;
    
    // Extraer URL con regex
    const urlMatch = imageUrlRaw.match(/(https?:\/\/[^\s\t]+)/);
    const imageUrl = urlMatch ? urlMatch[1].trim() : '/placeholder.svg';
    
    // Detectar si es Plus Size basado en talla
    const isPlus = /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(variant);
    
    return {
      id,
      code: id,
      category,
      subcategory: subcategory || category,
      size: variant || 'Única',
      fabric: fabric || 'N/A',
      price,
      imageUrl,
      box: subcategory || category,
      stock: 1, // Default stock
      collection: 'inbox', // Default to INBOX, will be manually classified
      isPlus
    };
  } catch (error) {
    console.error('Error parsing line:', lineNumber, error);
    return null;
  }
}

/**
 * Parses entire text/CSV file content
 */
export function parseCSVFile(fileContent: string): Partial<Product>[] {
  const lines = fileContent.split('\n');
  const products: Partial<Product>[] = [];
  
  lines.forEach((line, index) => {
    const product = parseCSVLine(line, index + 1);
    if (product) {
      products.push(product);
    }
  });
  
  return products;
}

/**
 * Classifies a product into one of the 5 universos based on manual selection
 */
export function classifyProduct(
  product: Partial<Product>,
  subcategory: string
): Collection {
  const lower = subcategory.toLowerCase();
  
  // UNIVERSO 1: Glamour & Fiesta
  if (
    lower.includes('vestido') ||
    lower.includes('dos piezas') ||
    lower.includes('blazer') ||
    lower.includes('jumpsuit') ||
    lower.includes('cocktail')
  ) {
    return 'glamour-fiesta';
  }
  
  // UNIVERSO 2: Executive Chic (Work & Casual)
  if (
    lower.includes('blusa') ||
    lower.includes('pantalon') ||
    lower.includes('camiseta') ||
    lower.includes('cardigan') ||
    lower.includes('falda') ||
    lower.includes('jean')
  ) {
    return 'work-casual';
  }
  
  // UNIVERSO 3: Curvy VIP
  if (lower.includes('plus')) {
    return 'curvy-edition';
  }
  
  // UNIVERSO 4: Winter Collection
  if (
    lower.includes('coat') ||
    lower.includes('jacket') ||
    lower.includes('sweater') ||
    lower.includes('abrigo')
  ) {
    return 'winter';
  }
  
  // UNIVERSO 5: Bazar / Family Market (default)
  return 'el-bazar';
}
