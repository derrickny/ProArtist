import React from 'react';
import {cn} from '@/lib/utils';

type props = { 
    title:string;
    className:string;
}

export default function PageTitle({title,className}: props) {
    return <h1 className={cn("text-2xl font-semibold text-primary",className)}>{title}</h1>
}