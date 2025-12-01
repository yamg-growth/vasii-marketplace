import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // A veces en Lovable es @/components/ui/use-toast, si falla usa este
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- TIPOS DE DATOS ---
interface ProductData {
  id: number;
  category: string;
  subcategory: string;
  size: string;
  details: string;
  price: number;
  image: string;
  collection: string;
}

// --- LÓGICA DE CLASIFICACIÓN (Misma que validamos antes) ---
const autoClassify = (cat: string, sub: string, size: string, det: string): string => {
  const text = `${cat} ${sub} ${det}`.toLowerCase();
  const sizeUpper = size ? size.toUpperCase() : '';
  
  if (text.includes('men') || text.includes('baby') || text.includes('kid') || text.includes('teen')) return 'EL BAZAR / FAMILY MARKET';
  if (['XL', 'XXL', '1XL', '2XL', '3XL', '4XL', '6XL'].some(s => sizeUpper.includes(s)) || text.includes('plus')) return 'CURVY EDITION';
  if (text.includes('coat') || text.includes('jacket') || text.includes('winter') || text.includes('outerwear')) return 'WINTER';
  if (text.includes('dress') || text.includes('party')) return 'GLAMOUR';
  return 'WORK & CASUAL';
};

// --- PARSER DEL TEXTO ---
const parseInventoryInput = (text: string): ProductData[] => {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  
  const results = lines.map((line) => {
    // Detecta si es Excel (Tab) o CSV (Coma)
    const separator = line.includes('\t') ? '\t' : ',';
    let cols = line.split(separator).map(c => c.trim());

    if (cols.length < 3) return null;

    // Busca la imagen (última columna con http) y el precio
    const imageIndex = cols.findLastIndex(c => c.startsWith('http'));
    const image = imageIndex !== -1 ? cols[imageIndex] : '';
    const priceRaw = cols.find(c => c.includes('$')) || cols[imageIndex - 1] || '0';
    const price = parseInt(priceRaw.replace(/[^0-9]/g, '')) || 0;

    let id = parseInt(cols[0]);
    if (isNaN(id)) return null;

    let category = cols[1] || 'General';
    let subcategory = cols[2] || '';
    let details = '';
    let size = '';

    const catUpper = category.toUpperCase();

    // Lógica para asignar columnas según categoría
    if (catUpper.includes('KIDS') || catUpper.includes('TEEN')) {
        size = cols[3] || '';
        details = (cols[4] || '') + ' ' + (cols[5] || ''); 
    } else if (catUpper.includes('MEN') && !catUpper.includes('WO')) {
      subcategory = cols[2]; 
      size = cols[4] || ''; 
      details = (cols[3] || '') + ' ' + (cols[5] || ''); 
    } else if (catUpper.includes('BABY') || catUpper.includes('MATERNITY')) {
      subcategory = cols[2]; 
      size = cols[5] || cols[cols.length - 3] || ''; 
      details = cols[3] || ''; 
    } else {
      size = cols[3] || '';
      details = cols[4] || '';
    }

    return {
      id,
      category,
      subcategory,
      size,
      details: details.trim(),
      price,
      image,
      collection: autoClassify(category, subcategory, size, details)
    };
  });

  return results.filter((item): item is ProductData => item !== null);
};

// --- COMPONENTE PRINCIPAL ---
export default function AdminUpload() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ProductData[]>([]);
  const { toast } = useToast();

  const handleProcess = () => {
    try {
      const data = parseInventoryInput(inputText);
      if (data.length === 0) {
        toast({ variant: "destructive", title: "Atención", description: "No se encontraron datos válidos." });
        return;
      }
      setPreview(data);
      toast({ title: "Datos Procesados", description: `Listo para cargar ${data.length} productos.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Verifica el formato del texto pegado." });
    }
  };

  const handleUpload = async () => {
    if (preview.length === 0) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .upsert(preview, { onConflict: 'id' });

      if (error) throw error;

      toast({ title: "¡Carga Exitosa!", description: `${preview.length} productos subidos a Supabase.` });
      setPreview([]);
      setInputText('');
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Error al subir", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Carga Masiva de Inventario (Chrome Admin)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Pega aquí la Data Maestra completa..." 
            className="min-h-[200px] font-mono text-xs mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex gap-4">
            <Button onClick={handleProcess} variant="outline">1. Procesar Datos</Button>
            <Button onClick={handleUpload} disabled={loading || preview.length === 0}>
              {loading ? "Subiendo..." : "2. Enviar a Supabase"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {preview.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left bg-white">
            <thead className="bg-gray-100 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3 text-blue-600">Colección (Auto)</th>
                <th className="px-4 py-3">Detalle</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Img</th>
              </tr>
            </thead>
            <tbody>
              {preview.slice(0, 20).map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono">{p.id}</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2 font-bold text-blue-600">{p.collection}</td>
                  <td className="px-4 py-2">{p.details} {p.size}</td>
                  <td className="px-4 py-2 text-green-600 font-bold">${p.price.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {p.image && <img src={p.image} className="h-8 w-8 object-cover rounded" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 text-center text-xs text-gray-500 bg-gray-50">
            Mostrando 20 de {preview.length} registros...
          </div>
        </div>
      )}
    </div>
  );
}
