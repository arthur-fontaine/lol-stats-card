import { useCallback } from 'react';

interface PictureInputProps {
  onImageChange?: (base64: string) => void;
}

export function PictureInput({ onImageChange }: PictureInputProps) {
  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) onImageChange?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  return (
    <label
      className="flex items-center justify-center bg-white/15 border border-accent/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors px-4"
    >
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        className="hidden"
        id="image-upload"
        required
      />
      <span className="text-white/80">Upload Image</span>
    </label>
  );
}
