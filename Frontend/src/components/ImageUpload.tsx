import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageViewer from './ImageViewer';

interface ImageUploadProps {
  onImageSelect: (images: File[]) => void;
  maxImages?: number;
  existingImages?: string[]; // Optional: For editing
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  maxImages = 5,
  existingImages = [],
}) => {
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>(existingImages);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedCount = maxImages - selectedFiles.length;

    const filesToAdd = files.slice(0, allowedCount);
    const newPreviews: string[] = [];
    const newFiles: File[] = [];

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedPreviews((prev) => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onImageSelect(updatedFiles); // ✅ Send real File[] to parent
  };

  const removeImage = (index: number) => {
    const updatedPreviews = selectedPreviews.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    onImageSelect(updatedFiles);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={selectedFiles.length >= maxImages}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Images</span>
          </Button>
          <span className="text-sm text-gray-500">
            {selectedFiles.length}/{maxImages} images selected
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedPreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedPreviews.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setViewerImage(image)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageViewer
        src={viewerImage || ''}
        alt="Product Image"
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
      />
    </>
  );
};

export default ImageUpload;