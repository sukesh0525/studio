'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { GovConnectLogo } from "@/components/govconnect-logo";
import { User, Briefcase, BookUser, Bot, LogOut } from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // In a real app, this would come from user data
  const isProfileComplete = true;

   const navItems = [
    { href: "/student/profile", label: "Profile", icon: User, disabled: false, tooltip: undefined },
    { href: "/student/jobs", label: "Jobs", icon: Briefcase, disabled: !isProfileComplete, tooltip: !isProfileComplete ? "Complete your profile to access" : undefined },
    { href: "/student/internships", label: "Internships", icon: BookUser, disabled: !isProfileComplete, tooltip: !isProfileComplete ? "Complete your profile to access" : undefined },
    { href: "/student/ai-resume-maker", label: "AI Resume Maker", icon: Bot, disabled: false, tooltip: undefined },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <GovConnectLogo className="size-8 text-sidebar-foreground" />
            <span className="text-lg font-semibold">GovConnect</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href} 
                  disabled={item.disabled} 
                  tooltip={item.tooltip}
                  variant="outline"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="outline">
                <Link href="/">
                  <LogOut />
                  <span>Sign Out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
           <SidebarTrigger />
           <h2 className="text-lg font-semibold">Student Dashboard</h2>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
