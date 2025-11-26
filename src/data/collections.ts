import { CollectionConfig } from '@/types/product';

export const COLLECTIONS: CollectionConfig[] = [
  {
    id: 'glamour-fiesta',
    name: 'GLAMOUR & FIESTA',
    description: '355 vestidos + dos piezas para Navidad/Año Nuevo',
    whatsappLink: 'https://wa.link/n46jdn',
    icon: '✨',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'work-casual',
    name: 'WORK & CASUAL',
    description: 'Blusas, cardigans, jeans, camisetas - Pack Amigas disponible',
    whatsappLink: 'https://wa.link/2e104u',
    icon: '👔',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'curvy-edition',
    name: 'CURVY EDITION',
    description: '107+ prendas plus size - Catálogo exclusivo',
    whatsappLink: 'https://wa.link/k3mqwg',
    icon: '💖',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'winter',
    name: 'WINTER',
    description: 'Coats, Jackets, Sweaters, Cardigans, Abrigos',
    whatsappLink: 'https://wa.link/cf5ms2',
    icon: '❄️',
    color: 'from-slate-500 to-blue-700'
  },
  {
    id: 'el-bazar',
    name: 'EL BAZAR / FAMILY MARKET',
    description: 'Hombre, bebé/maternity, sport, teens - Liquidación',
    whatsappLink: 'https://wa.link/ilx1rq',
    icon: '🛍️',
    color: 'from-orange-500 to-red-600'
  }
];

export const WHATSAPP_MESSAGE_TEMPLATES = {
  'glamour-fiesta': 'Hola! Me interesa un producto de la colección GLAMOUR & FIESTA',
  'work-casual': 'Hola! Me interesa un producto de la colección WORK & CASUAL',
  'curvy-edition': 'Hola! Me interesa un producto de la colección CURVY EDITION',
  'winter': 'Hola! Me interesa un producto de la colección WINTER',
  'el-bazar': 'Hola! Me interesa un producto de la colección EL BAZAR'
};
