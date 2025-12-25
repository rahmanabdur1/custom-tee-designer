import { Upload, Type, Image, Droplet } from 'lucide-react';

interface LeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onUploadClick: () => void;
}

const tools = [
  { id: 'upload', icon: Upload, label: 'Upload' },
  { id: 'text', icon: Type, label: 'Add Text' },
  { id: 'art', icon: Image, label: 'Add Art' },
  { id: 'product', icon: Droplet, label: 'Product Details' },
];

export function LeftToolbar({ activeTool, onToolChange, onUploadClick }: LeftToolbarProps) {
  const handleClick = (toolId: string) => {
    onToolChange(toolId);
    if (toolId === 'upload') {
      onUploadClick();
    }
  };

  return (
    <div className="w-20 bg-toolbar flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        
        return (
          <button
            key={tool.id}
            onClick={() => handleClick(tool.id)}
            className={`toolbar-icon w-16 ${isActive ? 'active' : 'text-toolbar-foreground'}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}
