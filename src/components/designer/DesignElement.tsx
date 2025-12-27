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

  // Helper: Calculate the bounding box size of a rotated rectangle
  const getRotatedSize = (w: number, h: number, rotation: number) => {
    const rad = (rotation * Math.PI) / 180;
    return {
      width: Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad)),
      height: Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(element.id);

    const rect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    onInteractionStart();
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onInteractionStart();
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

        // Calculate size of the rotated bounding box
        const rotated = getRotatedSize(element.width, element.height, element.rotation);
        
        // Offset calculation because CSS rotation happens from center
        const offsetX = (rotated.width - element.width) / 2;
        const offsetY = (rotated.height - element.height) / 2;

        // Constraint boundaries (incorporating rotation overflow)
        const minX = -offsetX;
        const maxX = designBounds.width - element.width - offsetX;
        const minY = -offsetY;
        const maxY = designBounds.height - element.height - offsetY;

        onUpdate(element.id, {
          x: Math.max(minX, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY)),
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const aspectRatio = element.originalWidth / element.originalHeight;
        
        // Calculate proposed new dimensions
        const proposedWidth = Math.max(element.originalWidth * 0.15, resizeStart.width + deltaX);
        const proposedHeight = proposedWidth / aspectRatio;

        // Check if rotated version of proposed size fits
        const rotated = getRotatedSize(proposedWidth, proposedHeight, element.rotation);
        const offsetX = (rotated.width - proposedWidth) / 2;
        const offsetY = (rotated.height - proposedHeight) / 2;

        const fitsX = (element.x - offsetX >= 0) && (element.x + proposedWidth + offsetX <= designBounds.width);
        const fitsY = (element.y - offsetY >= 0) && (element.y + proposedHeight + offsetY <= designBounds.height);

        if (fitsX && fitsY) {
          onUpdate(element.id, { width: proposedWidth, height: proposedHeight });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) onInteractionEnd();
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
      className={`absolute cursor-move select-none ${
        isSelected ? 'z-20' : 'z-10 hover:ring-1 ring-primary/30'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        transformOrigin: 'center center',
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={element.src}
        alt="Design Element"
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />

      {isSelected && (
        <>
          {/* Selection Border */}
          <div className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none" />

          {/* Action Buttons */}
          <div className="absolute inset-0 pointer-events-none">
             {/* Delete */}
             <button
              onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
              className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors pointer-events-auto z-30"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Duplicate */}
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }}
              className="absolute -top-3 -left-3 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors pointer-events-auto z-30"
            >
              <Copy className="w-3 h-3" />
            </button>

            {/* Resize Handle */}
            <div
              onMouseDown={handleResizeMouseDown}
              className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-se-resize shadow-lg hover:bg-blue-600 transition-colors pointer-events-auto z-30"
            >
              <Maximize2 className="w-3 h-3" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}