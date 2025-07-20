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
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : loading 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <FiUpload className={`w-8 h-8 ${
              isDragActive ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
            </p>
            <p className="text-gray-600 text-sm">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports PDF files up to 10MB
            </p>
          </div>
          
          {!loading && (
            <button
              type="button"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <FiX className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && !loading && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <FiFile className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-blue-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

