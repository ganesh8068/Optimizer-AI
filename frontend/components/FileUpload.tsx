import React, { useRef } from "react";
import { Icons } from "../constants";

interface FileUploadProps {
  label: string;
  id: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  onFileSelect,
  selectedFile,
  accept = ".pdf",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 group/container">
      <label className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors duration-300 ${selectedFile ? "text-indigo-600" : "text-slate-400 group-hover/container:text-slate-500"}`}>
        {label}
      </label>
      <div
        onClick={handleClick}
        className={`relative group flex flex-col items-center justify-center border-4 border-dashed rounded-[2rem] p-10 sm:p-14 cursor-pointer transition-all duration-500 overflow-hidden
          ${
            selectedFile
              ? "border-indigo-200 bg-indigo-50/20 shadow-inner"
              : "border-slate-100 bg-slate-50/50 hover:border-indigo-300 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        <div
          className={`relative w-20 h-20 rounded-3xl mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl
            ${selectedFile 
              ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-200" 
              : "bg-white text-slate-400 group-hover:text-indigo-600 group-hover:shadow-indigo-100 border border-slate-50"}`}
        >
          {selectedFile ? <Icons.Check size={32} /> : <Icons.Upload size={32} />}
        </div>

        <div className="text-center relative z-10">
          <span
            className={`block text-lg font-black tracking-tight mb-2 transition-colors duration-300
              ${selectedFile ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}
          >
            {selectedFile ? selectedFile.name : "Select PDF Document"}
          </span>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selectedFile ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Maximum size 10MB"}
            </p>
          </div>
        </div>

        {/* Progress pulse for selected state */}
        {selectedFile && (
          <div className="absolute top-0 right-0 p-4">
             <div className="text-[10px] font-black text-indigo-500 bg-indigo-100 px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm blur-[0.5px]">Ready</div>
          </div>
        )}
      </div>
    </div>
  );
};
