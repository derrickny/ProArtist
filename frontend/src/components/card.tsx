

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React, { ReactHTML } from "react";


// The props for the card component.
// props are the properties that are passed to a component.
export type CardProps = {
    // The label of the card.
    label: string;
    // The icon of the card.
    icon: LucideIcon;
    //the amount to be displayed in the card.
    amount: string;
    // The description of the card.
    description: string;
    };

//this is the card component that will be used to display the data in the dashboard.
export default function Card(props: CardProps) {
    return (
      <CardContent>
        <section className="flex justify-between gap-2">
          {/* label */}
          <p className="text-sm">{props.label}</p>
          {/* icon */}
          <props.icon className="h-4 w-4 text-gray-400" />
        </section>
        <section className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">{props.amount}</h2>
          <p className="text-xs text-gray-500">{props.description}</p>
        </section>
      </CardContent>
    );
  }
  
  export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        {...props}
        className={cn(
          "flex w-full flex-col gap-3 rounded-xl border p-5 shadow",
          props.className
        )}
      />
    );
  }
