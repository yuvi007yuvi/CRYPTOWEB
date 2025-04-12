import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { uploadImage } from '../../config/storage';
import Image from './Image';

const ImageUpload = ({ onUpload, onError, className, acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'] }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      onError?.('Invalid file type. Please upload an image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setProgress(0);

    try {
      const path = `images/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path);
      onUpload?.(url);
      setProgress(100);
    } catch (error) {
      onError?.(error.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && acceptedTypes.includes(file.type)) {
      handleUpload(file);
    } else {
      onError?.('Invalid file type. Please upload an image.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className={`relative ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
      />

      {preview ? (
        <div className="relative">
          <Image src={preview} alt="Upload preview" className="w-full h-full rounded-lg" />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="w-3/4">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors duration-200 flex flex-col items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500">Click or drag image to upload</p>
          <p className="text-sm text-gray-400 mt-2">
            {acceptedTypes.map(type => type.split('/')[1]).join(', ')} files only
          </p>
        </button>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  onUpload: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string)
};

ImageUpload.defaultProps = {
  className: '',
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif']
};

export default ImageUpload;