'use client';

import React, { useState, useEffect, useCallback,useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import { SaleContext } from '@/context/SalesContext';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    SearchIcon,
    Trash2
}
from 'lucide-react'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios ,{CancelTokenSource}from 'axios';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { debounce } from 'lodash';
import { Value } from '@radix-ui/react-select';
interface Country {
    alpha2Code: string;
    name: string;
    callingCodes: string[];
}

interface SelectOption {
    value: string;
    label: string;
    price: number; // Add the 'price' property to the SelectOption interface
}


type SaleAddProps = {
    className?: string;
};



export default function SaleAdd({ className }: SaleAddProps) {
    const [countryCodes, setCountryCodes] = useState<SelectOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const saleContext = useContext(SaleContext);

    if (!saleContext) {
        throw new Error('SaleAdd must be used within a SaleProvider');
    }

    const { addSaleItem,removeSaleItem,updateSaleItem,setCustomer,clearSale,finalizeSale } = saleContext;

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



    //Service Items
    const [items, setItems] = useState<any[]>([]);

    const addItem = (type: string) => {
    const newItem = { id: uuidv4(), type, service: '', staff: '', quantity: 1, price: 0, discount: 0, total: 0 };
    setItems([...items, newItem]);
    addSaleItem(newItem);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));

        // Remove the item from the context
        removeSaleItem(id);
    };


    //Services 
    const [services, setServices] = useState<any[]>([]);

useEffect(() => {
    const fetchServices = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/services');
            setServices(response.data);
           // console.log('Services:', response.data); // Log the services array
        } catch (error) {
            console.error(error);
        }
    };

    fetchServices();
}, []); // Log the services array

const serviceOptions = services.reduce((acc, service) => {
    if (!acc.find((group: { label: string }) => group.label === service.description)) {
        acc.push({
            label: service.description,
            options: services.filter(s => s.description === service.description).map(s => ({
                value: s.id,
                label: s.name,
                price: s.price
            }))
        });
    }
    return acc;
}, [] as Array<{ label: string, options: SelectOption[] }>);

//console.log('Service options:', serviceOptions); // Log the serviceOptions array


const [selectedService, setSelectedService] = useState<SelectOption | null>(null);

const calculateTotal = (price: number, discount: number, quantity: number) => {
    return ((price - (price * (discount / 100))) * quantity);
};

const handleServiceChange = (selectedService: SelectOption | null, itemId: string) => {
    setSelectedService(selectedService);

    // Update the price in the items array
    setItems(prevItems => {
        const updatedItems = prevItems.map(item => 
            item.id === itemId ? { ...item, price: selectedService?.price || 0, quantity: 1, total: calculateTotal(selectedService?.price || 0, item.discount, 1) } : item
        );

        // Update the item in the SaleDetails context
        const updatedItem = updatedItems.find(item => item.id === itemId);
        if (updatedItem) {
            updateSaleItem(itemId, updatedItem);
        }

        return updatedItems;
    });

    // Update the item in the context
    if (selectedService) {
        const item = items.find(item => item.id === itemId);
        if (item) {
            addSaleItem({
                id: itemId,
                type: 'service', // replace with the actual type
                serviceId: selectedService.value,
                price: selectedService.price,
                quantity: 1, // set the quantity to 1
                discount: item.discount, // use the actual discount
                total: calculateTotal(selectedService.price, item.discount, 1), // calculate the total with the actual discount and a quantity of 1
            });
        }
    }
};

const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const discount = Number(event.target.value);
    setItems(prevItems => prevItems.map(item => 
        item.id === itemId ? { ...item, discount, total: calculateTotal(item.price, discount, item.quantity) } : item
    ));

    // Update the item in the context
    const item = items.find(item => item.id === itemId);
    if (item) {
        updateSaleItem(itemId, { ...item, discount, total: calculateTotal(item.price, discount, item.quantity) });
    }
};

const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const quantity = Number(event.target.value);
    setItems(prevItems => prevItems.map(item => 
        item.id === itemId ? { ...item, quantity, total: calculateTotal(item.price, item.discount, quantity) } : item
    ));

    // Update the item in the context
    const item = items.find(item => item.id === itemId);
    if (item) {
        updateSaleItem(itemId, { ...item, quantity, total: calculateTotal(item.price, item.discount, quantity) });
    }
};


// Staff
const [staff, setStaff] = useState<SelectOption[]>([]);

useEffect(() => {
    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/staff');
            const staffOptions = response.data.map((staffMember: { id: string, first_name: string }) => ({
                value: staffMember.id,
                label: staffMember.first_name
            }));
            setStaff(staffOptions);
        } catch (error) {
            console.error(error);
        }
    };

    fetchStaff();
}, []);

const handleStaffChange = (selectedStaff: SelectOption | null, itemId: string) => {
    setItems(prevItems => prevItems.map(item => 
        item.id === itemId ? { ...item, staff: selectedStaff?.label || '' } : item
    ));
};

//products
const [products, setProducts] = useState<SelectOption[]>([]);

useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/products');
            const productOptions = response.data.map((product: { id: string, name: string, price: number }) => ({
                value: product.id,
                label: product.name,
                price: product.price
            }));
            setProducts(productOptions);
        } catch (error) {
            console.error(error);
        }
    };

    fetchProducts();
}, []);

const handleProductChange = (selectedProduct: SelectOption | null, itemId: string) => {
    setItems(prevItems => prevItems.map(item => 
        item.id === itemId ? { ...item, price: selectedProduct?.price || 0, total: calculateTotal(selectedProduct?.price || 0, item.discount, item.quantity) } : item
    ));
};


// Customer



// State and handlers for search term
const [searchTerm, setSearchTerm] = useState('');
// State and handlers for search results
const [searchResults, setSearchResults] = useState<any[]>([]);

// State and handlers for selected customer
const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

// State and handlers for add customer dialog
const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);

// State for search completed
const [searchCompleted, setSearchCompleted] = useState(false);

// State for customer exists
const [customerExists, setCustomerExists] = useState(false);



// Create an axios instance
const axiosInstance = axios.create();

let cancelTokenSource: CancelTokenSource | undefined;

// Function to search for a customer
const searchCustomer = useCallback(async () => {
    if (searchTerm.trim() !== '') {
        // Cancel the previous request
        if (cancelTokenSource) {
            cancelTokenSource.cancel();
        }

        // Create a new CancelToken
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cancelTokenSource = axios.CancelToken.source();

        try {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/customers/?search=${searchTerm}`, {
                cancelToken: cancelTokenSource.token
            });
            setSearchCompleted(true); // Set search as completed
            if (response.data.length > 0) {
                setSearchResults(response.data);
                setCustomerExists(true);
            } else {
                setSearchResults([]);
                setCustomerExists(false);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error searching for customer:', error);
                setSearchResults([]); // Clear results on error
                setSearchCompleted(true); // Set search as completed
                setCustomerExists(false);
            }
        }
    } else {
        setSearchResults([]);
        setSearchCompleted(false); // Reset the search state
        setCustomerExists(false);
    }
}, [searchTerm, axiosInstance]);

// Debounce the search function
const debouncedSearch = useCallback(() => {
    const debounced = debounce(searchCustomer, 500);
    debounced();
}, [searchCustomer]); // Removed unnecessary dependency 'searchTerm'

const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch();
};



const renderSearchResults = () => {
    if (searchResults.length > 0) {
        return (
            <ul className="absolute bg-white border border-gray-300 w-30 mt-1 rounded-md z-10">
                {searchResults.map(customer => (
                    <li key={customer.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleResultClick(customer)}>
                        {customer.mobile} - {customer.first_name} {customer.last_name}
                    </li>
                ))}
            </ul>
        );
    } else if (searchTerm !== '' && searchCompleted && searchResults.length === 0 && !customerExists) {
        // Show "Add Customer" button only if the search term is non-empty, search is completed, no results are found, and the customer does not exist
        return (
            <div className="mt-2">
                <Button onClick={() => setShowAddCustomerDialog(true)}>
                    Add Customer
                </Button>
            </div>
        );
    }
    return null; // Return null if none of the conditions are met
};

const handleResultClick = (customer: any) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.mobile.startsWith('0') ? customer.mobile.substring(1) : customer.mobile); // Adjust phone number format
    setSearchResults([]); // Clear the dropdown
};





// State and handlers for new customer fields
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [location, setLocation] = useState('');


// State and handlers for new customer object
const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    location: ''
});



// Function to add a new customer
const addCustomer = async () => {
    try {
        // Retrieve the Location instance
        const locationResponse = await axios.get(`http://127.0.0.1:8000/locations/?name=${encodeURIComponent(newCustomer.location)}`);
        if (locationResponse.data.length === 0) {
            throw new Error('Location not found');
        }
        const locationInstance = locationResponse.data[0];

        console.log('locationInstance:', locationInstance); // Log the locationInstance

        // Check if locationInstance is not undefined
        if (!locationInstance) {
            throw new Error('Invalid location');
        }

        // Create the new Customer
        const response = await axios.post('http://127.0.0.1:8000/customers/', {
            first_name: newCustomer.first_name,
            last_name: newCustomer.last_name,
            email: newCustomer.email,
            mobile: newCustomer.mobile,
            location: locationInstance.id // Assign the Location instance's id
        });
        setSelectedCustomer(response.data); // Update selectedCustomer state with the newly added customer
        setShowAddCustomerDialog(false); // Close the dialog
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            if (error.response.data.email) {
                console.error('Error: This email is already in use.');
            } else if (error.response.data.location) {
                console.error('Error: Invalid location id.');
            } else {
                console.error('Error adding new customer:', error.response.data);
            }
        } else {
            console.error('Error adding new customer:', error);
        }
    }
};



    return (
        <Card className={`${className} overflow-hidden overflow-x-auto overflow-y-auto h-[71vh] w-full sm:w-3/4 md:w-1/2 lg:w-3/5 mx-auto lg:mr-0 lg:ml-auto lg:overflow-x-auto`}>
            <CardHeader className='bg-muted/50'>
                <CardTitle>Sale Particulars</CardTitle>
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
                            <div className="relative w-80">
                                <Input
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            searchCustomer();
                                        }
                                    }}
                                    placeholder="Search by phone number/name/id"
                                    className="pr-20" // Add padding to the right of the input to make room for the button
                                />
    
                            <Button onClick={searchCustomer} className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 h-8">Search</Button>
                                <div className="absolute w-full mt-1">
                                    {renderSearchResults()}
                                </div>
                            </div>
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
                                                        className="w-30 text-xs"
                                                        options={item.type === 'product' ? products : serviceOptions}
                                                        onChange={(selectedService: SelectOption | null) => handleServiceChange(selectedService, item.id)}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-staff`} className='text-sm'>Staff</Label>
                                                    <Select
                                                        id={`${item.type}-staff`}
                                                        className="w-30 text-s" // Increase the width to 40
                                                        options={staff}
                                                        onChange={(selectedStaff: SelectOption | null) => handleStaffChange(selectedStaff, item.id)}
                                                    />
                                                </div>
                                                {item.type !== 'prepaid' && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor={`${item.type}-quantity`} className='text-sm'>Qty.</Label>
                                                        <Input 
                                                        id={`${item.type}-quantity`} 
                                                        type="number" 
                                                        className="w-20" 
                                                        defaultValue={item.quantity}
                                                        onChange={(event) => handleQuantityChange(event, item.id)}
                                                    />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-price`} className='text-sm'>Price (Ksh)</Label>
                                                <Input 
                                                    id={`${item.type}-price`} 
                                                    type="number" 
                                                    className="w-20" 
                                                    value={item.price} 
                                                />
                                              </div>
                                                {item.type !== 'prepaid' && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor={`${item.type}-discount`} className='text-sm'>Disc (%)</Label>
                                                        <Input 
                                                            id={`${item.type}-discount`} 
                                                            type="number" 
                                                            className="w-20" 
                                                            onChange={(event) => handleDiscountChange(event, item.id)}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={`${item.type}-total`} className='text-sm'>Total</Label>
                                                    <div className="flex items-center gap-3">
                                                    <Input 
                                                            id={`${item.type}-total`} 
                                                            type="number" 
                                                            className="w-20" 
                                                            disabled 
                                                            value={item.total.toFixed(2)} 
                                                        />
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
                        <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Customer</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    <div className="p-4">
                                        <label>
                                            First Name
                                            <Input
                                                type="text"
                                                name="first_name"
                                                value={newCustomer.first_name}
                                                onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                                                placeholder="First Name"
                                                className="mt-1 block w-full"
                                            />
                                        </label>
                                        <label className="mt-4">
                                            Last Name
                                            <Input
                                                type="text"
                                                name="last_name"
                                                value={newCustomer.last_name}
                                                onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                                                placeholder="Last Name"
                                                className="mt-1 block w-full"
                                            />
                                        </label>
                                        <label className="mt-4">
                                            Email
                                            <Input
                                                type="email"
                                                name="email"
                                                value={newCustomer.email}
                                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                                placeholder="Email"
                                                className="mt-1 block w-full"
                                            />
                                        </label>
                                        <label className="mt-4">
                                            Mobile
                                            <Input
                                                type="text"
                                                name="mobile"
                                                value={newCustomer.mobile}
                                                onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                                                placeholder="Mobile"
                                                className="mt-1 block w-full"
                                            />
                                        </label>
                                        <label className="mt-4">
                                            Location
                                            <select
                                                name="location"
                                                value={newCustomer.location}
                                                onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select Location</option>
                                                <option value="Mancave NSK">Mancave NSK</option>
                                                <option value="Mancave Kitengela">Mancave Kitengela</option>
                                            </select>
                                        </label>
                                    </div>
                                </DialogDescription>
                                <div className="flex justify-end mt-4">
                                    <Button variant="secondary" className="border border-gray-300" onClick={() => setShowAddCustomerDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={addCustomer}
                                        className="ml-4"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}