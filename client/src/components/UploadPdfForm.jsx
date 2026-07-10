import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';

export default function UploadPdfForm({ onUpload, loading }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid PDF file');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: loading
  });

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 select-none
          ${isDragActive 
            ? 'border-stone-900 bg-stone-50' 
            : loading 
            ? 'border-stone-200 bg-stone-100 cursor-not-allowed'
            : 'border-stone-400 hover:border-stone-900 hover:bg-stone-50/40'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border border-stone-250 shadow-sm ${
            isDragActive ? 'bg-stone-200' : 'bg-stone-50'
          }`}>
            <FiUpload className={`w-8 h-8 ${
              isDragActive ? 'text-stone-900' : 'text-stone-750'
            }`} />
          </div>
          
          <div>
            <p className="text-lg font-serif-cormorant font-bold text-stone-950 mb-2">
              {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
            </p>
            <p className="text-stone-605 text-xs">
              Drag and drop your study PDF file here, or click to browse
            </p>
            <p className="text-[10px] text-stone-400 font-mono mt-2 uppercase tracking-widest">
              Supports PDF files up to 10MB
            </p>
          </div>
          
          {!loading && (
            <button
              type="button"
              className="px-6 py-2.5 bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest border border-stone-900 rounded-xl transition-all shadow-sm"
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3.5 bg-red-50 border border-red-200 rounded-xl">
          <FiX className="w-5 h-5 text-red-650 mr-2" />
          <span className="text-xs font-semibold text-red-750">{error}</span>
        </div>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && !loading && (
        <div className="flex items-center justify-between p-4 bg-stone-50/50 border-2 border-stone-900 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center">
            <FiFile className="w-5 h-5 text-stone-800 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs font-serif-cormorant">
                {uploadedFile.name}
              </p>
              <p className="text-[10px] text-stone-500 font-mono">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-stone-500 hover:text-stone-900 p-1 rounded-full hover:bg-stone-100 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
