"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState } from "react"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (title: string) => {
    setActiveItem(title); // Cập nhật mục đang hoạt động
  };
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={activeItem === item.title} // Kiểm tra mục có đang hoạt động không
          >
            <Link href={item.url} onClick={() => handleItemClick(item.title)}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
