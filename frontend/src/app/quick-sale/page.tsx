import React from 'react';
import Checkout from '@/components/checkout';
import PageTitle from '@/components/pageTitle';
import SaleAdd from '@/components/SaleAdd';

type Props = { }

export default function QuickSale({}: Props) {
    return (
        <div>
            <PageTitle title="QuickSale" className="mb-4" />
            <div className="flex justify-between">
                <SaleAdd className="mr-4" />
                <Checkout/>
            </div>
        </div>
    )
}