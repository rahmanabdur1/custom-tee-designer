import { ZoomIn } from 'lucide-react';
import { ViewType, TShirtColor, DesignElement } from '@/types/designer';

interface ViewSwitcherProps {
  currentView: ViewType;
  color: TShirtColor;
  onViewChange: (view: ViewType) => void;
  elements: DesignElement[];
}

const colorMap: Record<TShirtColor, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  black: '#1a1a1a',
  white: '#fafafa',
  gray: '#6b7280',
};

function TShirtThumbnail({ 
  color, 
  label, 
  designElements 
}: { 
  color: string; 
  label: string; 
  designElements: DesignElement[];
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-20 relative bg-secondary/50 rounded-md overflow-hidden">
        <svg viewBox="0 0 60 75" className="w-full h-full">
          <path
            d="M30 3 C23 3 20 7 20 7 L8 12 L5 22 L12 25 L15 17 L15 72 L45 72 L45 17 L48 25 L55 22 L52 12 L40 7 C40 7 37 3 30 3 Z"
            fill={color}
            stroke={color}
            strokeWidth="1"
          />
          <ellipse cx="30" cy="9" rx="7" ry="4" fill={color} />
          <ellipse cx="30" cy="8" rx="5" ry="3" fill="#f5f5f5" />
        </svg>
        
        {/* Show actual uploaded images */}
        {designElements.map((el) => (
          <img
            key={el.id}
            src={el.src}
            alt="Design"
            className="absolute object-contain pointer-events-none"
            style={{
              left: `${((el.x - 100) / 185) * 24 + 18}px`,
              top: `${((el.y - 100) / 200) * 30 + 18}px`,
              width: `${(el.width / 185) * 24}px`,
              height: `${(el.height / 200) * 30}px`,
            }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

export function ViewSwitcher({ currentView, color, onViewChange, elements }: ViewSwitcherProps) {
  const frontElements = elements.filter(el => el.view === 'front');
  const backElements = elements.filter(el => el.view === 'back');
  
  return (
    <div className="w-24 bg-card border-l border-border flex flex-col items-center py-6 gap-4">
      <button
        onClick={() => onViewChange('front')}
        className={`view-thumbnail p-1 ${currentView === 'front' ? 'active' : ''}`}
      >
        <TShirtThumbnail color={colorMap[color]} label="Front" designElements={frontElements} />
      </button>
      
      <button
        onClick={() => onViewChange('back')}
        className={`view-thumbnail p-1 ${currentView === 'back' ? 'active' : ''}`}
      >
        <TShirtThumbnail color={colorMap[color]} label="Back" designElements={backElements} />
      </button>
      
      <button className="view-thumbnail p-2 mt-2">
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-xs text-muted-foreground text-center px-1">Sleeve Design</span>
          </div>
        </div>
      </button>
      
      <button className="mt-auto p-3 hover:bg-secondary rounded-lg transition-colors">
        <ZoomIn className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
