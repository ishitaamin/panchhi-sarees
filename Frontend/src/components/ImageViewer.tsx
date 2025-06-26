
import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.5, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.5, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            onClick={handleZoomIn}
            size="sm"
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            size="sm"
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
            disabled={zoom <= 1}
          >
            -
          </Button>
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div
          className="overflow-hidden cursor-zoom-in"
          style={{ maxHeight: '85vh', maxWidth: '90vw' }}
          onMouseMove={handleMouseMove}
        >
          <img
            src={src}
            alt={alt}
            className="transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: `${position.x}% ${position.y}%`,
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
