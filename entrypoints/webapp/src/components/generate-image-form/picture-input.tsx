import { useCallback, useState } from 'react';

interface PictureInputProps {
  onImageChange?: (base64: string) => void;
}

export function PictureInput({ onImageChange }: PictureInputProps) {
  const [hasImage, setHasImage] = useState(false);

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageChange?.(reader.result as string);
          setHasImage(true);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  return (
    <label
      className="flex flex-1 items-center justify-center bg-white/15 border border-accent/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors px-4 h-10.5 min-h-10.5 max-h-10.5"
    >
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        className="w-0 h-0 opacity-0 absolute cursor-pointer"
        id="image-upload"
        required
      />
      <span className="text-white/80">
        {hasImage ? 'Image Selected' : 'Upload Image'}
      </span>
    </label>
  );
}
