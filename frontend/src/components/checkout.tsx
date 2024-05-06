'use client';


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

export default function Component() {

const handleAddTip = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Add Tip');
};

const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Cancelled');
};
const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Saved');
};

  return (
    <Card className="overflow-hidden w-1/2 ml-auto">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Order Oe31b70H
          </CardTitle>
          <CardDescription>Date: November 23, 2023</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Billing Summary</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Sub Total:</span>
              <span>$1,670.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Grand Total:</span>
              <span>$1,670.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Change:</span>
              <span>$0.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Payable Amount:</span>
              <span>$0.00</span>
            </li>
          </ul>
 <Dialog>
  <DialogTrigger>
    <Button onClick={handleAddTip}>Add Tip</Button>
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
      <ClientButton variant="secondary" onClick={handleCancel}>
        Cancel
      </ClientButton>
      <ClientButton variant="default" onClick={handleSave} className="ml-4"> {/* Add left margin here */}
        Save
      </ClientButton>
    </div>
  </DialogContent>
</Dialog>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Method</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Card</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Mpesa</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
      </CardFooter>
    </Card>
  );
}

// const ClientButtonWrapper = ({ variant, children, onClick }: { variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"; children: React.ReactNode; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }) => {
//    return <ClientButton variant={variant}>{children}</ClientButton>;
// };