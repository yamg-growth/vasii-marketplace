import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileLoaded: (content: string, filename: string) => void;
}

export function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast({
        title: "Formato no válido",
        description: "Por favor sube un archivo .csv o .txt",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content, file.name);
      toast({
        title: "Archivo cargado",
        description: `${file.name} se ha cargado correctamente`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Error al cargar",
        description: "No se pudo leer el archivo",
        variant: "destructive"
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cargar Inventario
        </CardTitle>
        <CardDescription>
          Sube un archivo CSV o TXT con tus productos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`relative p-8 rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Arrastra tu archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceptados: .csv, .txt
              </p>
            </div>
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                Seleccionar archivo
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
