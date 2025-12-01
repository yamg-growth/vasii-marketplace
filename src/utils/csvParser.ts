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
 * REVERSE LOOKUP PARSING STRATEGY
 * Parses lines with flexible column detection for mixed inventories (Women, Men, Kids, Baby)
 */
export function parseCSVLine(line: string, lineNumber: number): Partial<Product> | null {
  if (!line.trim()) return null;
  
  // Ignorar líneas que no empiecen con número (headers como "WOMEN", etc.)
  if (!/^\d/.test(line.trim())) return null;
  
  try {
    // Split por tabulación o coma
    const columns = line.split(/[\t,]/).map(col => col.trim()).filter(col => col);
    
    if (columns.length < 5) return null;
    
    const id = columns[0];
    const category = columns[1] || '';
    
    if (!id || !category) return null;
    
    // REVERSE LOOKUP: Imagen es siempre la última columna con http
    let imageUrl = '/placeholder.svg';
    let imageIndex = -1;
    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].includes('http')) {
        const urlMatch = columns[i].match(/(https?:\/\/[^\s\t,]+)/);
        if (urlMatch) {
          imageUrl = urlMatch[1];
          imageIndex = i;
          break;
        }
      }
    }
    
    // REVERSE LOOKUP: Precio es la columna con $ O la anterior a la imagen
    let price = 0;
    let priceIndex = -1;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].includes('$') || /^\d+[,\.]?\d*$/.test(columns[i].replace(/[$\s,]/g, ''))) {
        const priceStr = columns[i].replace(/[$\s]/g, '').replace(/,/g, '');
        const parsedPrice = parseInt(priceStr);
        if (parsedPrice > 0) {
          price = parsedPrice;
          priceIndex = i;
          break;
        }
      }
    }
    
    // Si no encontramos precio, buscar la columna antes de la imagen
    if (price === 0 && imageIndex > 0) {
      const priceStr = columns[imageIndex - 1].replace(/[$\s]/g, '').replace(/,/g, '');
      price = parseInt(priceStr) || 0;
      priceIndex = imageIndex - 1;
    }
    
    // Subcategoría (columna 2)
    const subcategory = columns[2] || category;
    
    // TALLA Y DETALLES (lógica especial para MEN/KIDS/BABY vs WOMEN)
    let size = 'Única';
    let details = '';
    const isMenKidsBaby = /men|kid|teen|baby/i.test(category);
    
    if (isMenKidsBaby) {
      // Para hombres/niños, la talla puede estar desplazada
      // Buscar columna corta con patrón de talla
      const sizePatterns = /^(XXS|XS|S|M|L|XL|XXL|XXXL|\d+Y|\d+-\d+M|\d+)$/i;
      for (let i = 3; i < columns.length; i++) {
        if (i === priceIndex || i === imageIndex) continue;
        if (sizePatterns.test(columns[i])) {
          size = columns[i];
          break;
        }
      }
      // Unir resto de texto en details
      const detailsParts = columns.slice(3, priceIndex > 0 ? priceIndex : imageIndex);
      details = detailsParts.filter(p => p !== size).join(' - ');
    } else {
      // Para mujeres: estándar
      size = columns[3] || 'Única';
      details = columns.slice(4, priceIndex > 0 ? priceIndex : imageIndex).join(' - ');
    }
    
    // Detectar si es Plus Size
    const isPlus = /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(size);
    
    return {
      id,
      code: id,
      category,
      subcategory: subcategory || category,
      size,
      fabric: details || 'N/A',
      price,
      imageUrl,
      box: subcategory || category,
      stock: 1,
      collection: null, // NULL = INBOX (sin clasificar)
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
