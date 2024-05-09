import React from 'react';
import Checkout from '@/components/checkout';
import PageTitle from '@/components/pageTitle';
//import CardContent from '@/components/CardContent';

type Props = { }

export default function QuickSale({}: Props) {
    return (
        <div>
        <PageTitle title="QuickSale" className="mb-4" />
            <Checkout/>
        </div>
    )
}