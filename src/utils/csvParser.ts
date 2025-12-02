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
 * PARSER V2: REVERSE LOOKUP STRATEGY
 * Maneja columnas desplazadas en MEN, KIDS, BABY
 * Format: ID \t CATEGORY \t ... \t PRICE \t IMAGE_URL
 */
export function parseCSVLine(line: string, lineNumber: number): Partial<Product> | null {
  if (!line.trim()) return null;
  
  // Ignorar líneas que no empiecen con número (headers como "WOMEN", etc.)
  if (!/^\d/.test(line.trim())) return null;
  
  try {
    // Detectar separador (TAB o COMA)
    const separator = line.includes('\t') ? '\t' : ',';
    const columns = line.split(separator).map(col => col.trim()).filter(col => col);
    
    if (columns.length < 3) return null;
    
    // [0] ID siempre es la primera columna
    const id = columns[0];
    if (!id) return null;
    
    // [1] CATEGORY siempre es la segunda columna
    const category = columns[1];
    
    // REVERSE LOOKUP: Encuentra la ÚLTIMA columna que empiece por http
    let imageUrl = '/placeholder.svg';
    let imageIndex = -1;
    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].match(/(https?:\/\/[^\s\t]+)/)) {
        const urlMatch = columns[i].match(/(https?:\/\/[^\s\t]+)/);
        imageUrl = urlMatch ? urlMatch[1].trim() : '/placeholder.svg';
        imageIndex = i;
        break;
      }
    }
    
    // REVERSE LOOKUP: Encuentra el PRECIO justo antes de la imagen
    let price = 0;
    let priceIndex = -1;
    if (imageIndex > 0) {
      for (let i = imageIndex - 1; i >= 0; i--) {
        const col = columns[i];
        // Busca columna con $ o que sea numérico
        if (col.includes('$') || /^\d{1,3}(,\d{3})*$/.test(col.replace(/[$\s]/g, ''))) {
          const priceStr = col.replace(/[$\s]/g, '').replace(/,/g, '');
          price = parseInt(priceStr) || 0;
          priceIndex = i;
          break;
        }
      }
    }
    
    // CORRECCIÓN DE COLUMNAS según categoría
    let subcategory = '';
    let size = 'Única';
    let fabric = 'N/A';
    
    const isMenKidsBaby = /^(MEN|KIDS|TEEN|BABY|MATERNITY)/i.test(category);
    
    if (isMenKidsBaby) {
      // Para MEN/KIDS/BABY: columnas desplazadas
      // Busca la talla (columna corta: XL, XXL, 10Y, etc.)
      const sizeColumn = columns.slice(2, priceIndex > 0 ? priceIndex : columns.length)
        .find(col => /^(XXS|XS|S|M|L|XL|XXL|XXXL|\d+Y|\d+M)$/i.test(col));
      
      if (sizeColumn) {
        size = sizeColumn;
      }
      
      // Subcategoría es la columna 2 (si existe)
      subcategory = columns[2] || category;
      
      // Fabric: busca columnas con % o palabras como Cotton, Polyester
      const fabricColumn = columns.slice(2, priceIndex > 0 ? priceIndex : columns.length)
        .find(col => col.includes('%') || /cotton|polyester|viscose|spandex/i.test(col));
      
      if (fabricColumn) {
        fabric = fabricColumn;
      }
    } else {
      // Para WOMEN: columnas estándar
      subcategory = columns[2] || category;
      size = columns[3] || 'Única';
      fabric = columns[4] || 'N/A';
    }
    
    // Detectar si es Plus Size basado en talla
    const isPlus = /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(size);
    
    return {
      id,
      code: id,
      category,
      subcategory: subcategory || category,
      size,
      fabric,
      price,
      imageUrl,
      box: subcategory || category,
      stock: 1,
      collection: 'inbox',
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
