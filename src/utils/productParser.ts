import { Product } from '@/types/product';
import { classifyProductCollection, isProductPlusSize, parsePrice } from './productClassifier';

/**
 * Parses a product line from the inventory text file
 * Format: NEW CODE: 15501 - Vestidos 13 - Talla: L - Stock: 1 - Precio: $ 109,000 COP - URL: http://... - Fabric: ... - Comentarios: EXISTE
 */
export function parseProductLine(line: string): Product | null {
  // Skip empty lines and headers
  if (!line.trim() || line.startsWith('**') || line.startsWith('---') || !line.includes('NEW CODE:')) {
    return null;
  }

  try {
    // Extract code
    const codeMatch = line.match(/NEW CODE:\s*(\d+)/);
    if (!codeMatch) return null;
    const code = codeMatch[1];

    // Extract box/subcategory (text between code and "Talla:")
    const subcategoryMatch = line.match(/NEW CODE:\s*\d+\s*-\s*([^-]+)\s*-\s*Talla:/);
    if (!subcategoryMatch) return null;
    const box = subcategoryMatch[1].trim();

    // Extract size
    const sizeMatch = line.match(/Talla:\s*([^-]+)\s*-/);
    if (!sizeMatch) return null;
    const size = sizeMatch[1].trim();

    // Extract stock
    const stockMatch = line.match(/Stock:\s*(\d+)/);
    if (!stockMatch) return null;
    const stock = parseInt(stockMatch[1]);

    // Extract price
    const priceMatch = line.match(/Precio:\s*\$?\s*([\d,.]+)\s*COP/);
    if (!priceMatch) return null;
    const priceStr = priceMatch[1].replace(/\./g, '').replace(/,/g, '');
    const price = parseInt(priceStr);

    // Extract image URL
    const urlMatch = line.match(/URL:\s*(http[^\s]+)/);
    if (!urlMatch) return null;
    const imageUrl = urlMatch[1];

    // Extract fabric
    const fabricMatch = line.match(/Fabric:\s*([^-]+)\s*-\s*Comentarios/);
    const fabric = fabricMatch ? fabricMatch[1].trim() : 'N/A';

    // Determine category based on box/subcategory content
    const category = 'WOMEN';
    
    // Determine subcategory from box
    let subcategory = box;
    if (box.toLowerCase().includes('vestido')) {
      subcategory = 'Vestidos';
    } else if (box.toLowerCase().includes('dos piezas') || box.toLowerCase().includes('two piece')) {
      subcategory = 'Dos piezas';
    } else if (box.toLowerCase().includes('blusa')) {
      subcategory = 'Blusas';
    } else if (box.toLowerCase().includes('cardigan') || box.toLowerCase().includes('sweater')) {
      subcategory = 'Cardigans & Sweaters';
    } else if (box.toLowerCase().includes('coat') || box.toLowerCase().includes('jacket')) {
      subcategory = 'Coat & Jackets';
    } else if (box.toLowerCase().includes('jean')) {
      subcategory = 'Jeans';
    } else if (box.toLowerCase().includes('blazer')) {
      subcategory = 'Blazers';
    } else if (box.toLowerCase().includes('camiseta')) {
      subcategory = 'Camisetas';
    } else if (box.toLowerCase().includes('pantalon')) {
      subcategory = 'Pantalones';
    } else if (box.toLowerCase().includes('falda')) {
      subcategory = 'Faldas';
    } else if (box.toLowerCase().includes('top')) {
      subcategory = 'Tops';
    } else if (box.toLowerCase().includes('sport')) {
      subcategory = 'Sport';
    }

    // Classify into collection
    const collection = classifyProductCollection(category, subcategory, box);
    const isPlus = isProductPlusSize(category, subcategory, box);

    return {
      id: code,
      code,
      category,
      subcategory,
      size,
      fabric,
      price,
      imageUrl,
      box,
      stock,
      collection,
      isPlus
    };
  } catch (error) {
    console.error('Error parsing product line:', line, error);
    return null;
  }
}

/**
 * Parses the entire inventory text file
 */
export function parseInventoryFile(fileContent: string): Product[] {
  const lines = fileContent.split('\n');
  const products: Product[] = [];

  for (const line of lines) {
    const product = parseProductLine(line);
    if (product) {
      products.push(product);
    }
  }

  return products;
}
