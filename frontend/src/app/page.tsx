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

type OptionType = {
  label: string;
  value: string;
};

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
const [location, setLocation] = useState<string | null>(null);
return (
  <div>
    <PageTitle title="Dashboard" className="mb-4" />

    <Tabs>
      <TabsList>
        <TabsTrigger value="sales"> Sales Insight </TabsTrigger>
        <TabsTrigger value="staff"> Staff Insight </TabsTrigger>
        <TabsTrigger value="customer"> Customer Insight </TabsTrigger>
      </TabsList>

      <TabsContent value="sales">
        {/* Content for Sales Insight */}
        <div className="flex space-x-4">
          <div className="w-60">
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