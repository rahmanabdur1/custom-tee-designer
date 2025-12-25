import { Plus, Save, Share } from 'lucide-react';
import { TShirtColor } from '@/types/designer';
import { Button } from '@/components/ui/button';

interface ProductBarProps {
  color: TShirtColor;
  onColorChange: (color: TShirtColor) => void;
}

const colors: { id: TShirtColor; name: string; hex: string }[] = [
  { id: 'red', name: 'Red', hex: '#ef4444' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'black', name: 'Black', hex: '#1a1a1a' },
  { id: 'white', name: 'White', hex: '#fafafa' },
  { id: 'gray', name: 'Gray', hex: '#6b7280' },
];

export function ProductBar({ color, onColorChange }: ProductBarProps) {
  const currentColor = colors.find((c) => c.id === color);

  return (
    <div className="h-20 bg-card border-t border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Products
        </Button>
        
        <div className="flex items-center gap-3 ml-4">
          <div 
            className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
            style={{ backgroundColor: currentColor?.hex }}
          />
          <div>
            <p className="font-semibold text-foreground">Gildan Softstyle Jersey T-shirt</p>
            <button className="flex items-center gap-2 text-sm text-primary hover:underline">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: currentColor?.hex }}
              />
              {currentColor?.name}
              <span className="text-primary">Change Color</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Color picker dropdown hint */}
        <div className="flex gap-1 mr-4">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => onColorChange(c.id)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                color === c.id ? 'border-primary scale-110' : 'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
        
        <Button variant="outline" className="gap-2">
          <Save className="w-4 h-4" />
          Save
          <span className="text-muted-foreground">|</span>
          <Share className="w-4 h-4" />
          Share
        </Button>
        
        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Get Price
        </Button>
      </div>
    </div>
  );
}
