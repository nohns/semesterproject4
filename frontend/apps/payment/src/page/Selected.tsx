import React from 'react';
import { FooBar } from '@repo/ui';
import { useLocation } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';

function Selected() {
    const location = useLocation();
    const { itemId } = location.state || {};


    const mockProduct = {
        id: itemId,
        name: 'Blå vand',
        description: 'Smagen af blå og vand',
        originalPrice: 30,
        currentPrice: 15,
        timeStamp: new Date().toISOString(),
    };

    return (
        <>
            <FooBar />
            <div>
                {itemId && <div>Product Selected: {itemId}</div>}
                <ProductCard product={mockProduct} />
            </div>
        </>
    );
}

export default Selected;
