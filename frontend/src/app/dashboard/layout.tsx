"use client";

import { useAuthStore } from "@/store/authStore";
import { SiGoogleanalytics } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import Input from "@/components/ui/Input";
import { ChevronDown } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const generalMenuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "/assets/dashboard-icon.svg",
    },
    {
      name: "Campaign",
      href: "/dashboard/campaign",
      icon: "/assets/campaign-icon.svg",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      useReactIcon: true,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: "/assets/payment-icon.svg",
    },
  ];

  const supportMenuItems = [
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: "/assets/settings-icon.svg",
    },
    {
      name: "Help & Support",
      href: "/dashboard/help",
      icon: "/assets/help-icon.svg",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-white border-r border-gray-200">
        <SidebarHeader className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Link6ync" width={24} height={30} />
              <span className="text-lg font-bold text-gray-900">Link6ync</span>
            </div>
            <SidebarTrigger className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors" />
          </div>

          <div className="hidden group-data-[collapsible=icon]:flex justify-center w-full">
            <SidebarTrigger className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors" />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 bg-white group-data-[collapsible=icon]:px-0">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              General
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generalMenuItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.name}
                      className={
                        isActive(item.href)
                          ? "!bg-primary !text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        {item.useReactIcon ? (
                          <SiGoogleanalytics
                            className={`w-5 h-5 flex-shrink-0 ${
                              isActive(item.href) ? "text-white" : "text-gray-600"
                            }`}
                          />
                        ) : (
                          <Image
                            src={item.icon!}
                            alt={item.name}
                            width={20}
                            height={20}
                            className={`flex-shrink-0 ${isActive(item.href) ? "brightness-0 invert" : ""}`}
                          />
                        )}
                        <span className="font-medium group-data-[collapsible=icon]:hidden transition-opacity duration-200">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportMenuItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.name}
                      className={
                        isActive(item.href)
                          ? "!bg-primary !text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                          className={`flex-shrink-0 ${isActive(item.href) ? "brightness-0 invert" : ""}`}
                        />
                        <span className="font-medium group-data-[collapsible=icon]:hidden transition-opacity duration-200">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="group-data-[collapsible=icon]:hidden">
        </div>
      </Sidebar>

      <SidebarInset className="bg-gray-50 bg-[#FDFCFC]">
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
          {/* Header Search */}
          <div className="w-full max-w-[380px]">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-10 pr-4 py-2 bg-white border-gray-200 rounded-lg text-sm"
                leftIcon={
                  <Image 
                    src="/assets/search-icon.svg" 
                    alt="Search" 
                    width={16} 
                    height={16}
                    className="opacity-50"
                  />
                }
              />
            </div>
          </div>

          {/* User Profile */}
          <Link href="/dashboard/settings" className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 relative flex justify-center items-center bg-gray-100">
               {user?.profilePicture ? (
                 <img
                   src={user.profilePicture}
                   alt={user.name || "User"}
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <Image
                   src="/assets/account-icon.svg" 
                   alt="User"
                   width={24}
                   height={24}
                   className="opacity-70"
                 />
               )}
            </div>
          </Link>
        </div>
        <div>
           {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
