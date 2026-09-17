import { useRef, useState, useEffect } from "react";

export default function ImageUploader({ setImage, initialImage }) {
     const inputRef = useRef();
     const [preview, setPreview] = useState(null);

     useEffect(() => {
          if (!initialImage) {
               setPreview(null);
          } else if (typeof initialImage === "string") {
               setPreview(initialImage);
          } else if (initialImage instanceof File || initialImage instanceof Blob) {
               try {
                    const objectUrl = URL.createObjectURL(initialImage);
                    setPreview(objectUrl);
                    return () => URL.revokeObjectURL(objectUrl);
               } catch (e) {
                    setPreview(null);
               }
          } else {
               setPreview(null);
          }
     }, [initialImage]);

     const handleFile = (selectedFile) => {
          if (!selectedFile) return;
          try {
               const objectUrl = URL.createObjectURL(selectedFile);
               setPreview(objectUrl);
               setImage(selectedFile);
          } catch (e) {
               console.error("Failed to generate preview for selected file:", e);
               setImage(selectedFile);
          }
     };

     const handleDrop = (e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer?.files?.[0];
          if (droppedFile) {
               handleFile(droppedFile);
          }
     };

     return (
          <div
               onDragOver={(e) => e.preventDefault()}
               onDrop={handleDrop}
               onClick={() => inputRef.current?.click()}
               className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 transition-colors bg-gray-50/50 hover:bg-orange-50/20"
          >
               <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onClick={(e) => {
                         e.stopPropagation();
                         e.target.value = null;
                    }}
                    onChange={(e) => handleFile(e.target.files?.[0])}
               />

               {preview ? (
                    <div className="relative group w-full flex flex-col items-center justify-center">
                         <img
                              src={preview}
                              alt="Preview"
                              className="max-h-36 max-w-full object-contain rounded-lg shadow-sm"
                              onError={() => setPreview(null)}
                         />
                         <span className="text-[10px] text-gray-400 mt-1 hover:text-orange-600 transition-colors">Click or drop new file to replace image</span>
                    </div>
               ) : (
                    <div className="py-2 text-gray-400">
                         <p className="text-xs font-semibold text-gray-600">Drop image here or click to upload</p>
                         <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, WEBP</p>
                    </div>
               )}
          </div>
     );
}