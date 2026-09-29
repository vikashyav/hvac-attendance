"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface MobileSidebarProps {
  children: React.ReactNode
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 z-[1000]">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Choose a page to continue.</SheetDescription>
        <div className="h-full" onClickCapture={(event) => {
          if (event.target instanceof Element && event.target.closest("a[href]")) setOpen(false)
        }}>{children}</div>
      </SheetContent>
    </Sheet>
  )
}
