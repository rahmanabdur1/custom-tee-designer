import { useState, useCallback, useRef } from 'react';
import { RotateCw, RotateCcw } from 'lucide-react';
import { ViewType, DesignElement, TShirtColor } from '@/types/designer';
import { DesignElementComponent } from './DesignElement';

interface TShirtCanvasProps {
  view: ViewType;
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}
const tshirtImageMap: Record<ViewType, string> = {
  front: '/front_tshirt.jpg',
  back: '/back_shirt.jpg',
};
export function TShirtCanvas({
  view,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: TShirtCanvasProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const filteredElements = elements.filter((el) => el.view === view);
  const zoneSize = { width: 250, height: 350 };

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onSelectElement(null);
  }, [onSelectElement]);

  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center relative p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div 
          ref={canvasRef} 
          className="relative w-[500px] h-[500px]" 
          onClick={handleCanvasClick}
        >
          {/* Background T-Shirt */}
     <img
  src={tshirtImageMap[view]}
  className="w-full h-full object-cover"
  alt={`${view} Shirt`}
/>


          {/* Design Area Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`relative transition-all duration-200 ${
                isInteracting ? 'border border-dashed border-gray-400' : 'border border-transparent'
              }`}
              style={{ width: zoneSize.width, height: zoneSize.height, pointerEvents: 'auto' }}
            >
              {/* Conditional Labels */}
          {isInteracting && view === 'front' && (
                <>
                  <span className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase">Adult</span>
                  <div className="absolute top-2 right-2 w-14 h-16 border border-gray-300/40 flex p-1">
                    <span className="text-[7px] text-gray-400 font-bold leading-tight">LEFT CHEST</span>
                  </div>
                </>
              )}

              {isInteracting && view === 'back' && (
                <>
                  <span className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase">Adult</span>
               
                </>
              )}

              {filteredElements.map((element) => (
                <DesignElementComponent
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={onSelectElement}
                  onUpdate={onUpdateElement}
                  onDelete={onDeleteElement}
                  onDuplicate={onDuplicateElement}
                  designBounds={{ x: 0, y: 0, width: zoneSize.width, height: zoneSize.height }}
                  onInteractionStart={() => setIsInteracting(true)}
                  onInteractionEnd={() => setIsInteracting(false)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}