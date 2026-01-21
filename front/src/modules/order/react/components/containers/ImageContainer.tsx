import React from 'react';

interface ImageContainerProps {
  children: React.ReactNode;
  objectFit?: "image-contain" | "image-cover" | "image-fill"; 
  key?: number | string
  classNames?: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ children, objectFit, classNames = '' }) => {
  return <div className={`image-container ${objectFit} ${classNames}`}>{children}</div>;
};

export default ImageContainer;