'use client';
import React, { useContext,useEffect,useState } from 'react';
import {
SearchIcon
}
from "lucide-react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ClientButton from "@/components/ClientButton";

import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { SaleContext } from "@/context/SalesContext";

type checkout = {
  className?: string;
};

export default function Component({ className }: checkout){

    const context = useContext(SaleContext);

    if (!context) {
      throw new Error("Component must be used within a SaleProvider");
    }

    const { saleDetails } = context;
    const total = saleDetails.total;

const handleAddTip = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Add Tip');
};

const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Cancelled');
};
const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Saved');
};
const handleCheckout = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Checkout');
  // Add your checkout logic here
};

const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Reset');
  // Add your reset logic here
};

const [mpesaPayment, setMpesaPayment] = useState(0);
const [cardPayment, setCardPayment] = useState(0);
const [payableAmount, setPayableAmount] = useState(total);

useEffect(() => {
  setPayableAmount(total - mpesaPayment - cardPayment);
}, [total, mpesaPayment, cardPayment]);

const handleMpesaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setMpesaPayment(Number(event.target.value));
};

const handleCardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setCardPayment(Number(event.target.value));
};

  return (
    <Card className={`${className} flex flex-col overflow-hidden w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto lg:mr-0 lg:ml-auto`}>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            SALE ID: {"Oe31b70H".toUpperCase()}
          </CardTitle>
          <CardDescription>
            Date: {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold text-lg">Billing Summary</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Sub Total:</span>
              <span className='text-sm'>Ksh {total}</span>
            </li>
                <li className="flex items-center justify-between">
                    <span className="text-muted-foreground text">Grand Total:</span>
                    <span className="font-bold text-lg"><span className="text-sm">Ksh</span> {total}</span>
                </li>
            <Dialog>
              <DialogTrigger>
                <div className="flex justify-start">
                  <Button onClick={handleAddTip} className="text-xs py-1 px-2 h-8">Add Tip</Button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Tip</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="p-4">
                    <label>
                      Tip Amount
                      <Input type="number" className="mt-1 block w-full" />
                    </label>
                    <Separator className="my-4 opacity-0" />
                    <label className="mt-10"> {/* Increase the top margin here */}
                      Staff Tipped
                      <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md"> {/* Add custom styles here */}
                        <option>Staff 1</option>
                        <option>Staff 2</option>
                        <option>Staff 3</option>
                      </select>
                    </label>
                  </div>
                </DialogDescription>
                <div className="flex justify-end mt-4">
                  <ClientButton variant="secondary" className="border border-gray-300"onClick={handleCancel}>
                    Cancel
                  </ClientButton>
                  <ClientButton variant="default" onClick={handleSave} className="ml-4"> {/* Add left margin here */}
                    Save
                  </ClientButton>
                </div>
              </DialogContent>
            </Dialog>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Change:</span>
              <span>KSH 0.00</span>
            </li>
            <li className="flex items-center justify-between border-t pt-3 " >
            <span className="text-muted-foreground font-bold text-xl text-black ">Payable Amount:</span>
            <span className="font-bold text-xl"> Ksh {payableAmount.toFixed(2)}</span>
          </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold text-lg">Payment Method</div>
          <div className="flex gap-3">
          <div>
            <span className="text-muted-foreground">Card</span>
            <Input type="text" placeholder="Enter amount" className="mt-2" onChange={handleCardChange} />
          </div>
          <div>
            <span className="text-muted-foreground">Mpesa</span>
            <Input type="text" placeholder="Enter amount" className="mt-2" onChange={handleMpesaChange} />
          </div>
          </div>
        </div>
      </CardContent>
<div className="bg-muted flex-grow">
  <CardFooter className="flex flex-row items-center justify-between border-t px-6 py-3">
    <div>
      <Button onClick={handleReset} className="mr-2 border border-gray-300" variant="secondary">Reset</Button>
      <Button onClick={handleCheckout} >Checkout</Button>
    </div>
  </CardFooter>
</div>
    </Card>
  );
}

// const ClientButtonWrapper = ({ variant, children, onClick }: { variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"; children: React.ReactNode; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }) => {
//    return <ClientButton variant={variant}>{children}</ClientButton>;
// };