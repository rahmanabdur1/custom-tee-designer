import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { ViewType, DesignElement, TShirtColor } from '@/types/designer';
import { LeftToolbar } from './LeftToolbar';
import { EditPanel } from './EditPanel';
import { TShirtCanvas } from './TShirtCanvas';
import { ViewSwitcher } from './ViewSwitcher';
import { ProductBar } from './ProductBar';

// Extract dominant colors from image (simplified)
function extractColors(img: HTMLImageElement): string[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#000000'];
  
  canvas.width = 50;
  canvas.height = 50;
  ctx.drawImage(img, 0, 0, 50, 50);
  
  const imageData = ctx.getImageData(0, 0, 50, 50);
  const data = imageData.data;
  
  const colorCounts: Record<string, number> = {};
  
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const a = data[i + 3];
    
    if (a > 128) {
      const key = `rgb(${r},${g},${b})`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
  }
  
  return Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([color]) => color);
}

export function TShirtDesigner() {
  const [activeTool, setActiveTool] = useState('upload');
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [tshirtColor, setTshirtColor] = useState<TShirtColor>('red');
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const colors = extractColors(img);
        
        // Calculate initial size (max 120px width/height, maintain aspect ratio)
        const maxSize = 120;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        // Center position in 
       
        const zoneWidth = 260;
        const zoneHeight = 300;
      const centerX = (zoneWidth - width) / 2;
         const centerY = (zoneHeight - height) / 2;
     




     const newElement: DesignElement = {
  id: `element-${Date.now()}`,
  type: 'image',
  src: event.target?.result as string,
  x: centerX,
  y: centerY,
  width,
  height,
  originalWidth: img.width,
  originalHeight: img.height,
  rotation: 0,
  colors,
  view: currentView,
  zone: 'center',
};

        setElements((prev) => [...prev, newElement]);
        setSelectedElementId(newElement.id);
        toast.success('Image uploaded successfully!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  }, [currentView]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    toast.success('Element deleted');
  }, [selectedElementId]);

  const handleDuplicateElement = useCallback((id: string) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const newElement: DesignElement = {
      ...element,
      id: `element-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    toast.success('Element duplicated');
  }, [elements]);

  const handleClosePanel = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left toolbar */}
        <LeftToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onUploadClick={handleUploadClick}
        />

        {/* Edit panel - shown when element selected */}
        {selectedElement && (
          <EditPanel
            element={selectedElement}
            onClose={handleClosePanel}
            onUpdate={handleUpdateElement}
            onDuplicate={handleDuplicateElement}
            onDelete={handleDeleteElement}
          />
        )}

        {/* T-Shirt canvas */}
        <TShirtCanvas
          view={currentView}
          color={tshirtColor}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
        />

        {/* View switcher */}
        <ViewSwitcher
          currentView={currentView}
          color={tshirtColor}
          onViewChange={setCurrentView}
          elements={elements}
        />
      </div>

      {/* Product bar */}
      <ProductBar
        color={tshirtColor}
        onColorChange={setTshirtColor}
      />
    </div>
  );
}


