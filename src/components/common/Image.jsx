import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Image = ({ src, alt, className, fallbackSrc, lazy = true }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <svg
            className="w-8 h-8 text-gray-300"
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
        </div>
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`w-full h-full object-cover ${!loaded ? 'invisible' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading={lazy ? 'lazy' : 'eager'}
      />
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackSrc: PropTypes.string,
  lazy: PropTypes.bool
};

Image.defaultProps = {
  className: '',
  fallbackSrc: 'https://via.placeholder.com/400x300?text=Image+Not+Found',
  lazy: true
};

export default Image;