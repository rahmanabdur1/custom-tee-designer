import { X, AlignCenter, Layers, FlipHorizontal, FlipVertical, Copy, Crop, RotateCcw } from 'lucide-react';
import { DesignElement } from '@/types/designer';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface EditPanelProps {
  element: DesignElement | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EditPanel({ element, onClose, onUpdate, onDuplicate, onDelete }: EditPanelProps) {
  if (!element) return null;

  const widthInches = (element.width / 10).toFixed(2);
  const heightInches = (element.height / 10).toFixed(2);

  const handleRotationChange = (value: number[]) => {
    onUpdate(element.id, { rotation: value[0] });
  };

  return (
    <div className="w-72 bg-panel border-r border-panel-border flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-panel-border">
        <h3 className="font-semibold text-foreground">Edit Upload</h3>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Upload Size */}
        <div className="panel-section">
          <p className="text-sm text-muted-foreground mb-2">Upload Size</p>
          <p className="text-xs text-muted-foreground mb-2">Width × Height</p>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={widthInches}
              readOnly
              className="w-20 text-center"
            />
            <span className="text-sm text-muted-foreground">in</span>
            <span className="text-muted-foreground">×</span>
            <Input
              type="text"
              value={heightInches}
              readOnly
              className="w-20 text-center"
            />
            <span className="text-sm text-muted-foreground">in</span>
          </div>
        </div>

        {/* Edit Colors */}
        <div className="panel-section">
          <p className="text-sm text-muted-foreground mb-2">Edit Colors</p>
          <p className="text-xs text-muted-foreground mb-2">{element.colors.length} Colors Found</p>
          <div className="flex flex-wrap gap-2">
            {element.colors.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                style={{ backgroundColor: color }}
              />
            ))}
            {element.colors.length > 5 && (
              <button className="w-8 h-8 rounded border-2 border-border flex items-center justify-center text-xs text-muted-foreground hover:border-primary">
                ...
              </button>
            )}
          </div>
        </div>

        {/* Make One Color */}
        <div className="panel-section">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Make One Color <span className="text-green-500 text-xs font-medium">New!</span>
            </span>
            <Switch />
          </div>
        </div>

        {/* Remove Background */}
        <div className="panel-section">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Remove Background Color</span>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="panel-section">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button className="control-button" title="Center">
              <AlignCenter className="w-5 h-5" />
            </button>
            <button className="control-button" title="Layering">
              <Layers className="w-5 h-5" />
            </button>
            <button className="control-button" title="Flip Horizontal">
              <FlipHorizontal className="w-5 h-5" />
            </button>
            <button className="control-button" title="Flip Vertical">
              <FlipVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground mb-4">
            <span className="flex-1 text-center">Center</span>
            <span className="flex-1 text-center">Layering</span>
            <span className="flex-1 text-center" style={{ gridColumn: 'span 2' }}>Flip</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="control-button"
              onClick={() => onDuplicate(element.id)}
              title="Duplicate"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button className="control-button" title="Crop">
              <Crop className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground mt-1">
            <span className="flex-1 text-center">Duplicate</span>
            <span className="flex-1 text-center">Crop</span>
          </div>
        </div>

        {/* Rotation */}
        <div className="panel-section">
          <p className="text-sm text-muted-foreground mb-3">Rotation</p>
          <div className="flex items-center gap-4">
            <button 
              className="p-1 hover:bg-secondary rounded"
              onClick={() => onUpdate(element.id, { rotation: 0 })}
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
            <Slider
              value={[element.rotation]}
              onValueChange={handleRotationChange}
              min={-180}
              max={180}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={element.rotation}
              onChange={(e) => onUpdate(element.id, { rotation: parseInt(e.target.value) || 0 })}
              className="w-16 text-center"
            />
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(element.id)}
          className="w-full py-2 px-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
