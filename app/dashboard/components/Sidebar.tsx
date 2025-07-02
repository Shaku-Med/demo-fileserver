import React from 'react';
import { Home, Image, Folder, Monitor, Download, FileText, Music, Video, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

const sidebarItems = [
  { name: "Home", icon: Home, active: false },
  { name: "Gallery", icon: Image, active: false },
  { name: "Medzy - Personal", icon: Folder, active: false },
  { name: "Desktop", icon: Monitor, active: false },
  { name: "Downloads", icon: Download, active: false },
  { name: "Documents", icon: FileText, active: false },
  { name: "Pictures", icon: Image, active: true },
  { name: "Music", icon: Music, active: false },
  { name: "Videos", icon: Video, active: false },
];

const additionalFolders = [
  "TOONIOY",
  "APPWORK", 
  "Screen Recordings",
  "TOBD"
];

export function DashboardSidebar() {
  return (
    <Sidebar className={`bg-card/80 backdrop-blur-lg`}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="text-lg font-semibold">Explorer</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=' px-5'>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={item.active}
                    tooltip={item.name}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>This PC</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="This PC">
                  <ChevronRight className="w-4 h-4" />
                  <span>This PC</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenuSub>
              {additionalFolders.map((folder, index) => (
                <SidebarMenuSubItem key={index}>
                  <SidebarMenuSubButton>
                    <Folder className="w-4 h-4" />
                    <span>{folder}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 