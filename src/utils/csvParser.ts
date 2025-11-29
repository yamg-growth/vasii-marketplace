import { Product, Collection } from '@/types/product';

export interface CSVRow {
  CODE: string;
  'BAR - CODE': string;
  ID: string;
  CATEGORY: string;
  VARIETY: string; // Size
  FABRIC: string;
  PRICE: string;
  IMAGE_SOURCE: string;
}

/**
 * Parses a CSV line into a product object
 */
export function parseCSVLine(line: string, lineNumber: number): Partial<Product> | null {
  if (!line.trim() || lineNumber === 1) return null; // Skip empty lines and header
  
  try {
    const parts = line.split(',');
    
    if (parts.length < 8) return null;
    
    const code = parts[0]?.trim();
    const barCode = parts[1]?.trim();
    const id = parts[3]?.trim();
    const category = parts[4]?.trim();
    const variety = parts[5]?.trim(); // Size
    const fabric = parts[6]?.trim();
    const priceStr = parts[7]?.trim();
    const imageSource = parts[8]?.trim();
    
    if (!code || !id || !category) return null;
    
    // Parse price: "$ 69,000" -> 69000
    const price = parseInt(priceStr.replace(/[$.]/g, '').replace(/,/g, '')) || 0;
    
    // Extract image URL from IMAGE_SOURCE if it contains http/https
    let imageUrl = '';
    if (imageSource) {
      const urlMatch = imageSource.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        imageUrl = urlMatch[0];
      }
    }
    
    return {
      id: code,
      code,
      barCode,
      category,
      subcategory: category, // Will be manually classified
      size: variety,
      fabric: fabric || 'N/A',
      price,
      imageUrl: imageUrl || '/placeholder.svg',
      box: category,
      stock: 1, // Default stock
      collection: 'el-bazar', // Default, will be manually classified
      isPlus: false
    };
  } catch (error) {
    console.error('Error parsing CSV line:', lineNumber, error);
    return null;
  }
}

/**
 * Parses entire CSV file content
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
