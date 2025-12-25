import { useRef, useState, useEffect } from 'react';
import { X, Copy, Maximize2 } from 'lucide-react';
import { DesignElement as DesignElementType } from '@/types/designer';

interface DesignElementProps {
  element: DesignElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DesignElementType>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  designBounds: { x: number; y: number; width: number; height: number };
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}

export function DesignElementComponent({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  designBounds,
  onInteractionStart,
  onInteractionEnd,
}: DesignElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(element.id);
    
    const rect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    onInteractionStart(); // Show parent border
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onInteractionStart(); // Show parent border
    setResizeStart({
      width: element.width,
      height: element.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && elementRef.current?.parentElement) {
        const rect = elementRef.current.parentElement.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        
        const minX = designBounds.x;
        const maxX = designBounds.x + designBounds.width - element.width;
        const minY = designBounds.y;
        const maxY = designBounds.y + designBounds.height - element.height;
        
        onUpdate(element.id, { 
          x: Math.max(minX, Math.min(newX, maxX)), 
          y: Math.max(minY, Math.min(newY, maxY)) 
        });
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const aspectRatio = element.originalWidth / element.originalHeight;
        
        const maxWidthFromPosition = designBounds.x + designBounds.width - element.x;
        const maxHeightFromPosition = designBounds.y + designBounds.height - element.y;
        const maxWidthFromHeight = maxHeightFromPosition * aspectRatio;
        
        const maxWidth = Math.min(maxWidthFromPosition, maxWidthFromHeight, 200);
        const newWidth = Math.max(30, Math.min(maxWidth, resizeStart.width + deltaX));
        const newHeight = newWidth / aspectRatio;
        
        onUpdate(element.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        onInteractionEnd(); // Hide parent border
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, element, onUpdate, designBounds, onInteractionStart, onInteractionEnd]);

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move select-none ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={element.src}
        alt="Design"
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-3 h-3" />
          </button>
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-se-resize shadow-lg"
          >
            <Maximize2 className="w-3 h-3" />
          </div>
        </>
      )}
    </div>
  );
}