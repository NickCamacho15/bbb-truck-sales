"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  )
}
