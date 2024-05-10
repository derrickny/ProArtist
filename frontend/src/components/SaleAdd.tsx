'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    Trash2
}
from 'lucide-react'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { Button } from './ui/button';

interface Country {
    alpha2Code: string;
    name: string;
    callingCodes: string[];
}

interface SelectOption {
    value: string;
    label: string;
}

type SaleAddProps = {
    className?: string;
};

export default function SaleAdd({ className }: SaleAddProps) {
    const [countryCodes, setCountryCodes] = useState<SelectOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    useEffect(() => {
        axios.get('https://restcountries.com/v2/all')
            .then(response => {
                const codes = response.data.map((country: Country) => ({
                    value: country.alpha2Code,
                    label: `+${country.callingCodes[0]} ${country.name}`
                }));
                setCountryCodes(codes);
            })
            .catch((error: Error) => console.error(error));
    }, []);

    const handleCountryCodeChange = (selectedOption: SelectOption | null) => {
        setSelectedOption(selectedOption);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const [selectedItemType, setSelectedItemType] = useState<string>('');
    const [items, setItems] = useState<any[]>([]);

    const addItem = (type: string) => {
        setSelectedItemType(type);
        setItems([...items, { id: uuidv4(), type, service: '', staff: '', quantity: 0, price: 0, discount: 0, total: 0 }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const serviceOptions = [
        { value: 'gentlemens-cut', label: 'Gentlemen\'s Cut' },
        { value: 'bespoke-cut', label: 'Bespoke Cut' },
    ];

    return (
<Card className={`${className} overflow-hidden overflow-x-auto overflow-y-auto h-[71vh] w-full sm:w-3/4 md:w-1/2 lg:w-3/5 mx-auto lg:mr-0 lg:ml-auto`}>
            <CardHeader className='bg-muted/50'>
                <CardTitle>Customer Sale Particulars</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="customer" className='text-lg'>Customer</Label>
                        <div className="flex gap-3">
                            <Select
                                id="countryCode"
                                value={selectedOption}
                                onChange={handleCountryCodeChange}
                                options={countryCodes}
                                defaultInputValue='+254 Kenya'
                                placeholder="Select country code"
                                className="w-22"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        border: '1px solid #ccc',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            border: '1px solid #ccc',
                                        },
                                    }),
                                    dropdownIndicator: (provided) => ({
                                        ...provided,
                                        color: '#333',
                                    }),
                                    indicatorSeparator: () => ({
                                        display: 'none',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        borderRadius: '10px',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? '#ccc' : 'white',
                                        '&:hover': {
                                            backgroundColor: '#eee',
                                        },
                                    }),
                                }}
                            />
                            <Input
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                placeholder="Enter phone number"
                                className="w-1/2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date" className='text-lg'>Date</Label>
                        <Input id="date" type="date" className="w-1/2" min={currentDate} max={currentDate} />
                    </div>
                    {/* Add more fields as needed */}
                    <div>
                        {items.map((item, index) => (
                            <div key={item.id}>
                                <div className="flex gap-3">
                                    {['service', 'product', 'package', 'giftvoucher', 'prepaid'].includes(item.type) &&
                                        (
                                            <>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-type`} className='text-sm'>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Label>
                                                    <Select
                                                        id={`${item.type}-type`}
                                                        className="w-100"
                                                        options={item.type === 'service' ? serviceOptions : []}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-staff`} className='text-sm'>Staff</Label>
                                                    <Input id={`${item.type}-staff`} className="w-20" />
                                                </div>
                                                {item.type !== 'prepaid' && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor={`${item.type}-quantity`} className='text-sm'>Qty.</Label>
                                                        <Input id={`${item.type}-quantity`} type="number" className="w-20" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-price`} className='text-sm'>Price</Label>
                                                    <Input id={`${item.type}-price`} type="number" className="w-20" />
                                                </div>
                                                {item.type !== 'prepaid' && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor={`${item.type}-discount`} className='text-sm'>Disc.</Label>
                                                        <Input id={`${item.type}-discount`} type="number" className="w-20" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-total`} className='text-sm'>Total</Label>
                                                    <div className="flex items-center gap-3">
                                                        <Input id={`${item.type}-total`} type="number" className="w-20" disabled value="0.00" />
                                                        <Trash2 className='text-red-500' onClick={() => removeItem(item.id)} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                </div>
                                {(index < items.length - 1 && items[index + 1].type !== item.type) &&
                                    <div className="py-2">
                                        <hr />
                                    </div>
                                }  {/* Add a separator with padding after each different type of item */}
                            </div>
                        ))}
                        <div className="flex flex-col gap-3">
                            <Label className='text-lg pt-3'>Add items</Label>
                            <div className="flex gap-3">
                                <Button onClick={() => addItem('service')}>Service</Button>
                                <Button onClick={() => addItem('product')}>Product</Button>
                                <Button onClick={() => addItem('package')}>Package</Button>
                                <Button onClick={() => addItem('giftvoucher')}>Gift Voucher</Button>
                                <Button onClick={() => addItem('prepaid')}>Prepaid</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
