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
 * Parses a text line into a product object
 * Format: NEW CODE: 21300 - Men Denim Shirts - Talla: XXL - Stock: 1 - Precio: $83,000 COP - URL: http://... - Fabric: 19%Polyester - Comentarios: EXISTE
 */
export function parseCSVLine(line: string, lineNumber: number): Partial<Product> | null {
  if (!line.trim() || line.startsWith('**') || line.startsWith('---') || line.startsWith('=')) {
    return null; // Skip empty lines, headers, and separators
  }
  
  try {
    // Check if line starts with "NEW CODE:"
    if (!line.includes('NEW CODE:')) return null;
    
    // Extract fields using regex and split
    const codeMatch = line.match(/NEW CODE:\s*(\d+)/);
    const subcategoryMatch = line.match(/NEW CODE:\s*\d+\s*-\s*([^-]+?)\s*-\s*Talla:/);
    const sizeMatch = line.match(/Talla:\s*([^-]+?)\s*-\s*Stock:/);
    const stockMatch = line.match(/Stock:\s*(\d+)/);
    const priceMatch = line.match(/Precio:\s*\$?\s*([\d,]+)/);
    const urlMatch = line.match(/URL:\s*(https?:\/\/[^\s]+)/);
    const fabricMatch = line.match(/Fabric:\s*([^-]+?)(?:\s*-\s*Comentarios:|$)/);
    
    if (!codeMatch || !subcategoryMatch) return null;
    
    const code = codeMatch[1].trim();
    const subcategory = subcategoryMatch[1].trim();
    const size = sizeMatch ? sizeMatch[1].trim() : 'Única';
    const stock = stockMatch ? parseInt(stockMatch[1]) : 1;
    const priceStr = priceMatch ? priceMatch[1].trim() : '0';
    const imageUrl = urlMatch ? urlMatch[1].trim() : '/placeholder.svg';
    const fabric = fabricMatch ? fabricMatch[1].trim() : 'N/A';
    
    // Parse price: "83,000" -> 83000
    const price = parseInt(priceStr.replace(/[$.]/g, '').replace(/,/g, '')) || 0;
    
    return {
      id: code,
      code,
      category: subcategory,
      subcategory,
      size,
      fabric,
      price,
      imageUrl,
      box: subcategory,
      stock,
      collection: 'el-bazar', // Default, will be manually classified
      isPlus: subcategory.toLowerCase().includes('plus')
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
