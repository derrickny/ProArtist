// ClientButton.tsx


import { Button } from "@/components/ui/button"
import { ReactNode, MouseEvent } from "react";

type ClientButtonProps = {
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    children: ReactNode;
    className?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void; // Add this line
};

export default function ClientButton({ variant, children, className, onClick }: ClientButtonProps) {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        // Handle click event here
        console.log('Button clicked');
        if (onClick) onClick(event);
    }

    return (
        <Button variant={variant} onClick={handleClick} className={className}>
            {children}
        </Button>
    )
}