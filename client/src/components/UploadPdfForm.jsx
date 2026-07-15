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
    maxSize: 50 * 1024 * 1024,
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
          relative border-3 border-stone-900 rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 select-none bg-white shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(28,25,23,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
          ${isDragActive ? 'bg-stone-50' : loading ? 'bg-stone-100 cursor-not-allowed border-stone-300 shadow-none hover:translate-y-0' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-stone-900 bg-[#FEF5D1] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FiUpload className="w-8 h-8 text-stone-950" />
          </div>
          
          <div>
            <p className="text-xl font-serif-cormorant font-bold text-stone-950 mb-1.5">
              {isDragActive ? 'Drop your PDF here' : 'Select PDF Document'}
            </p>
            <p className="text-stone-850 text-xs font-bold font-serif-cormorant">
              Drag and drop your PDF study material here, or click to browse files
            </p>
            <p className="text-[9px] text-stone-900 font-mono mt-2.5 uppercase tracking-widest font-extrabold bg-stone-100 border border-stone-300 rounded px-2.5 py-1 inline-block">
              Supports files up to 50MB
            </p>
          </div>
          
          {!loading && (
            <button
              type="button"
              className="px-6 py-3 bg-[#F8C537] hover:bg-stone-900 border-2 border-stone-900 text-stone-950 hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3.5 bg-red-50 border-2 border-stone-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <FiX className="w-5 h-5 text-red-750 mr-2 flex-shrink-0" />
          <span className="text-xs font-bold text-red-950 uppercase tracking-wide">{error}</span>
        </div>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && !loading && (
        <div className="flex items-center justify-between p-4 bg-white border-2 border-stone-900 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center">
            <FiFile className="w-5 h-5 text-stone-950 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-950 truncate max-w-[200px] sm:max-w-xs font-serif-cormorant">
                {uploadedFile.name}
              </p>
              <p className="text-[10px] text-stone-900 font-mono font-bold">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-stone-500 hover:text-stone-950 p-1 rounded-full hover:bg-stone-100 transition-colors border border-stone-200 hover:border-stone-900"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
