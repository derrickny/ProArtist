import React from 'react';
import Checkout from '@/components/checkout';
import PageTitle from '@/components/pageTitle';
import SaleAdd from '@/components/SaleAdd';

type Props = { }

export default function QuickSale({}: Props) {
    return (
        <div>
            <PageTitle title="QuickSale" className="mb-4" />
            <div className="flex flex-col md:flex-row justify-between">
                <SaleAdd className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mb-3 md:mb-0 md:mr-3" />
                <Checkout className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"/>
            </div>
        </div>
    )
}