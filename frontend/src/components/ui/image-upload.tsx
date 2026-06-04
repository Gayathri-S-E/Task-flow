import React, { useRef, useState, useEffect } from "react";
import { Camera, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value?: string | null;
  onChange: (base64: string | null) => void;
  initials?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  initials = "U",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-brand-500/40 shadow-xl shadow-brand-500/10">
          {preview ? (
            <img
              src={preview}
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl">
              {initials}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 rounded-full flex items-center justify-center bg-dark-950/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Change profile picture"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-3 cursor-pointer border border-dashed border-dark-700 hover:border-brand-500/50 rounded-xl px-4 py-3 transition-all group w-full"
      >
        <Camera className="h-5 w-5 text-dark-500 group-hover:text-brand-400 transition-colors" />
        <div>
          <p className="text-xs font-semibold text-dark-300 group-hover:text-white transition-colors">
            {preview ? "Change profile picture" : "Upload profile picture"}
          </p>
          <p className="text-xs text-dark-500 mt-0.5">PNG, JPG or WEBP — max 2MB</p>
        </div>
        {preview && (
          <span className="ml-auto text-xs text-emerald-400 font-medium flex items-center space-x-1">
            <Check className="h-3.5 w-3.5" />
            <span>Image selected</span>
          </span>
        )}
      </div>
    </div>
  );
};
export default ImageUpload;
