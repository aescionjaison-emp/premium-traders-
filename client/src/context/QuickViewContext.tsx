import React, { createContext, useContext, useState } from 'react';
import { IProduct } from '../types/index.js';

interface QuickViewContextType {
  selectedProduct: IProduct | null;
  isOpen: boolean;
  openQuickView: (product: IProduct) => void;
  closeQuickView: () => void;
  enquiryProduct: IProduct | null;
  isEnquiryOpen: boolean;
  openEnquiry: (product?: IProduct) => void;
  closeEnquiry: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [enquiryProduct, setEnquiryProduct] = useState<IProduct | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const openQuickView = (product: IProduct) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const openEnquiry = (product?: IProduct) => {
    setEnquiryProduct(product || null);
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
    setTimeout(() => setEnquiryProduct(null), 300);
  };

  return (
    <QuickViewContext.Provider
      value={{
        selectedProduct,
        isOpen,
        openQuickView,
        closeQuickView,
        enquiryProduct,
        isEnquiryOpen,
        openEnquiry,
        closeEnquiry,
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
};

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) throw new Error('useQuickView must be used within QuickViewProvider');
  return context;
};
