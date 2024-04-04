/** @format */

// ProductCard.tsx

import React from "react";

export interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}
// Probably shouldn't be using React FC
// This only works if the aspect ratios are all the same
const ProductCard: React.FC<{ product: ProductProps }> = ({ product }) => {
  return (
    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden m-4">
      <img className="w-full object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-5">
        <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
          {product.name}
        </h5>
        <p className="font-normal text-gray-700 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-3xl text-gray-900">{product.price}</span>
          <button className="px-6 py-2.5 bg-black text-white text-xs font-medium uppercase rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
