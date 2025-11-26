import { CollectionConfig } from '@/types/product';

export const COLLECTIONS: CollectionConfig[] = [
  {
    id: 'glamour-fiesta',
    name: 'GLAMOUR & FIESTA',
    description: '355 vestidos + dos piezas para Navidad/Año Nuevo',
    whatsappLink: 'https://api.whatsapp.com/send?phone=573246294342&text=Hola%20VaSii%2C%20quiero%20conocer%20su%20colecci%C3%B3n%20SHEIN%20de%20GLAMOUR%20%26%20FIESTA%20%E2%9C%A8%20para%20entrega%20inmediata%20%E2%81%89%EF%B8%8F',
    icon: '✨',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'work-casual',
    name: 'WORK & CASUAL',
    description: 'Blusas, cardigans, jeans, camisetas - Pack Amigas disponible',
    whatsappLink: 'https://api.whatsapp.com/send?phone=573246294342&text=Hola%20VaSii%2C%20quiero%20conocer%20su%20colecci%C3%B3n%20SHEIN%20de%20WORK%20%26%20CASUAL%20%F0%9F%92%81%20para%20entrega%20inmediata%20%E2%81%89%EF%B8%8F',
    icon: '👔',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'curvy-edition',
    name: 'CURVY EDITION',
    description: '107+ prendas plus size - Catálogo exclusivo',
    whatsappLink: 'https://api.whatsapp.com/send?phone=573246294342&text=Hola%20VaSii%2C%20quiero%20conocer%20su%20colecci%C3%B3n%20SHEIN%20de%20CURVY%20EDITION%20%F0%9F%92%AB%20para%20entrega%20inmediata%20%E2%81%89%EF%B8%8F',
    icon: '💖',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'winter',
    name: 'WINTER',
    description: 'Coats, Jackets, Sweaters, Cardigans, Abrigos',
    whatsappLink: 'https://api.whatsapp.com/send?phone=573246294342&text=Hola%20VaSii%2C%20quiero%20conocer%20su%20colecci%C3%B3n%20SHEIN%20de%20WINTER%20%F0%9F%A5%B6%20para%20entrega%20inmediata%20%E2%81%89%EF%B8%8F',
    icon: '❄️',
    color: 'from-slate-500 to-blue-700'
  },
  {
    id: 'el-bazar',
    name: 'EL BAZAR / FAMILY MARKET',
    description: 'Hombre, bebé/maternity, sport, teens - Liquidación',
    whatsappLink: 'https://api.whatsapp.com/send?phone=573246294342&text=Hola%20VaSii%2C%20quiero%20conocer%20su%20colecci%C3%B3n%20SHEIN%20de%20EL%20BAZAR%20%2F%20FAMILY%20MARKET%F0%9F%91%B6%F0%9F%A7%94%20para%20entrega%20inmediata%20%E2%81%89%EF%B8%8F',
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
