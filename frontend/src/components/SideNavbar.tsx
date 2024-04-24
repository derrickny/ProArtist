import React, { useState, useEffect } from 'react';
import { Nav } from './ui/nav';

type props = { }

import {
  AlertCircle,
  Archive,
  ArchiveX,
  BarChartBig,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardPenLine,
  Cog,
  File,
  Gauge,
  Handshake,
  Inbox,
  LayoutDashboard,
  MessagesSquare,
  Search,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

import { Button } from './ui/button';
// Debounced values
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from '@react-hook/window-size'


export default function SideNavbar({}: props) {
const [isCollapsed, setIsCollapsed] = useState(false)
const onlyWidth = useWindowWidth()
// const [onlyWidth, setOnlyWidth] = useState(0) // Initialize onlyWidth with 0

// useEffect(() => {
//   // Ensure window object is defined
//   if (typeof window !== 'undefined') {
//     setOnlyWidth(window.innerWidth) // Set onlyWidth to window's innerWidth
//   }
// }, [])


const mobilewidth = onlyWidth < 768

function toggleCollapseSideBar(){
    setIsCollapsed(!isCollapsed)
}




    return (
      <div className='relative min-w-[100px] border-r px-10 pb-20 pt-24'>
        {!mobilewidth && (
          <div className='absolute right-[-20px] top-7'>
            <Button 
              onClick={toggleCollapseSideBar} 
              variant='secondary' 
              className='rounded-full p-2'
            >
              {isCollapsed ? <ChevronRight/> : <ChevronLeft/>} 
            </Button>
          </div>
        )}
        <Nav
          isCollapsed={mobilewidth ? true : isCollapsed}
          links={[
            {
              title: "Dashboard",
              href: "/",
              icon: LayoutDashboard,
              variant: "default",
            },
            {
              title: "Quick Sale",
              href: "/quick-sale",
              icon: ShoppingBag,
              variant: "ghost",
            },
            {
              title: "Appointments",
              href: "/appointments",
              icon: ClipboardPenLine,
              variant: "ghost",
            },
            {
              title: "Customers",
              href: "/customers",
              icon: UsersRound,
              variant: "ghost",
            },
            {
              title: "Campaigns",
              href: "/campaigns",
              icon: Gauge,
              variant: "ghost",
            },
            {
              title: "Feedback",
              href: "/feedback",
              icon: MessagesSquare,
              variant: "ghost",
            },
            {
              title: "Online Booking",
              href: "/online-booking",
              icon: ClipboardCheck,
              variant: "ghost",
            },
            {
              title: "Lead Management",
              href: "/lead-management",
              icon: Handshake,
              variant: "ghost",
            },
            {
              title: "Reports",
              href: "/reports",
              icon: BarChartBig,
              variant: "ghost",
            },
            {
              title: "Settings",
              href: "/settings",
              icon: Cog,
              variant: "ghost",
            },
          ]}
        />
      </div>
    )
    }   
