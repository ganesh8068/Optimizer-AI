
import React, { useRef } from 'react';
import { Icons } from '../constants';

interface FileUploadProps {
  label: string;
  id: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, id, onFileSelect, selectedFile, accept = ".pdf" }) => {
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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div 
        onClick={handleClick}
        className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 
          ${selectedFile 
            ? 'border-indigo-400 bg-indigo-50/30' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
      >
        <input 
          ref={inputRef}
          type="file" 
          id={id}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        <div className={`p-3 rounded-full mb-3 transition-colors ${selectedFile ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          {selectedFile ? <Icons.Check /> : <Icons.Upload />}
        </div>
        
        <span className={`text-sm font-medium ${selectedFile ? 'text-indigo-700' : 'text-slate-600'}`}>
          {selectedFile ? selectedFile.name : 'Click to upload PDF'}
        </span>
        <p className="text-xs text-slate-400 mt-1">PDF file up to 10MB</p>
      </div>
    </div>
  );
};
