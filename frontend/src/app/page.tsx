"use client" 

import PageTitle from "@/components/pageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import React from "react";
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar";
import ReactSelect, { ActionMeta } from 'react-select';
import  { useState } from 'react';
import Card, { CardContent, CardProps } from "@/components/card";

type OptionType = {
  label: string;
  value: string;
};
import {
  Wallet,
  DollarSign,
  CreditCard,
  Activity,
  Receipt,
  HandCoins,
  FileX,
  Gem,
  WalletCards
}
from "lucide-react"


const CardData: CardProps[] = [
  {
    label: "Bill Count",
    icon: Wallet,
    amount: "385",
    description: "Total number of bills",
  },
  {
    label: "Total Bill Count",
    icon: DollarSign,
    amount: "Ksh 100,000",
    description: "The amount collected, apart from the redemption amount, staff tips and unpaid value.",
  },
  {
    label: "Average Bill Value",
    icon: Activity,
    amount: "Ksh 1,300",
    description: "The average value of a bill.",
  },
  {
    label: "Total Expenses Value",
    icon: CreditCard,
    amount: "Ksh 0",
    description: "The total value of expenses.",
  },
  {
    label: "Cancelled Bill Count",
    icon: FileX,
    amount: "8",
    description: "The number of bills that were cancelled.",
  },
  {
    label: "Cancelled Bill Value",
    icon: Receipt,
    amount: "Ksh 100,000",
    description: "The total value of cancelled bills.",
  },
  {
    label: "Staff Tips Value", 
    icon: HandCoins,
    amount: "Ksh 11,500",
    description: "The total value of staff tips.",
  },
  {
    label: "Unpaid Value",
    icon: WalletCards,
    amount: "Ksh 500",
    description: "The total value of unpaid bills.",
  },
  {
    label: "Rewards Points Value",
    icon: Gem,
    amount: "Ksh 0",
    description: "The total value of rewards points.",
  },
  

]


export default function Home() {

  const [date, setDate] = React.useState<DateRange | undefined>({
  from: new Date(2024, 0, 20),
  to: addDays(new Date(2024, 0, 20), 20),
});
const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
const [showDatePicker, setShowDatePicker] = React.useState(false);

React.useEffect(() => {
  if (selectedOption === 'custom') {
    setShowDatePicker(true);
  } else {
    setShowDatePicker(false);
  }
}, [selectedOption]);
const [activeTab, setActiveTab] = React.useState('sales');
const [location, setLocation] = useState<string | null>(null);
return (
  <div>
    <PageTitle title="Dashboard" className="mb-4" />

    <Tabs>
      <TabsList>
        <TabsTrigger 
          value="sales" 
          style={{backgroundColor: activeTab === 'sales' ? '#fbd137' : ''}}
          onClick={() => setActiveTab('sales')}
        >
          Sales Insight
        </TabsTrigger>
        <TabsTrigger 
          value="staff" 
          style={{backgroundColor: activeTab === 'staff' ? '#fbd137' : ''}}
          onClick={() => setActiveTab('staff')}
        >
          Staff Insight
        </TabsTrigger>
        <TabsTrigger 
          value="customer" 
          style={{backgroundColor: activeTab === 'customer' ? '#fbd137' : ''}}
          onClick={() => setActiveTab('customer')}
        >
          Customer Insight
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sales">
        {/* Content for Sales Insight */}
        <div className="flex space-x-4 mb-4" >
          <div className="w-80" >
            <ReactSelect
              options={[
                { value: 'Mancave_nsk', label: 'Mancave NSK' },
                { value: 'Mancave_kitengela', label: 'Mancave Kitengela' },
              ]}
              defaultValue={{ value: 'Mancave_nsk', label: 'Mancave NSK' }} 
              onChange={(option: OptionType | null) => {
                if (option) {
                  setLocation(option.value);
                  // Fetch new data and update your cards and graphs here
                }
              }}
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderRadius:'14px'
                }),
                menu: (styles) => ({
                  ...styles,
                  borderRadius:'14px',
                  padding:'6px'
                }),
                option: (styles, { isFocused }) => {
                  return {
                    ...styles,
                    backgroundColor: isFocused 
                      ? '#fbd137' // color for the highlighted option
                      : undefined,
                    color: 'black',
                    borderRadius:'15px',
                    padding:'10px',
                  };
                },
              }}
            />
          </div>
          <div className="w-60">
            <ReactSelect
              options={[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'current_month', label: 'Current Month' },
                { value: 'last_7_days', label: 'Last 7 Days' },
                { value: 'last_14_days', label: 'Last 14 Days' },
                { value: 'last_30_days', label: 'Last 30 Days' },
                { value: 'custom', label: 'Custom Range' },
              ]}
              defaultValue={{ value: 'today', label: 'Today' }}
              onChange={(option: OptionType | null) => {
                if (option) {
                  setSelectedOption(option.value);
                  if (option.value === 'custom') {
                    setShowDatePicker(true);
                  } else {
                    setShowDatePicker(false);
                  }
                }
              }}
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderRadius:'14px'
                }),
                menu: (styles) => ({
                  ...styles,
                  borderRadius:'14px',
                  padding:'6px',
                  fontSize: '0.8rem', // reduce text size
                  width: '236px', // reduce menu width
                  height: '300px',
                }),
                option: (styles, { isFocused }) => {
                  return {
                    ...styles,
                    fontSize: '0.8rem',
                    backgroundColor: isFocused 
                      ? '#fbd137' // color for the highlighted option
                      : undefined,
                    color: 'black',
                    borderRadius:'15px',
                    padding:'10px',
                  };
                }
              }}
            />
          </div>

          {showDatePicker && (
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all
        sm:grid-cols-2 xl:grid-cols-4">
          {CardData.map((d, i) => ( 
            <Card
              key={i}
              label={d.label}
              icon={d.icon}
              amount={d.amount}
              description={d.description}
            />
          ))}
        </section>
        <section>
          {/* Add your graphs and charts here */}
          <CardContent>
            <p className="p-4 font-semibold"></p>
          </CardContent>
        </section>
      </TabsContent>
      <TabsContent value="staff">
        <div>
          Staff Insight Content
        </div>
      </TabsContent>
      <TabsContent value="customer">
        <div>
          Customer Insight Content
        </div>
      </TabsContent>
    </Tabs>
  </div>
);
}