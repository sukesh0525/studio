import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Building2, LayoutDashboard, LogOut, FileCheck2 } from "lucide-react";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="theme-company">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <GovConnectLogo className="size-8 text-sidebar-foreground" />
            <span className="text-lg font-semibold">GovConnect</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/profile">
                  <Building2 />
                  <span>Company Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/jobs">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/resume-analyzer">
                  <FileCheck2 />
                  <span>Resume Analyzer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
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
           <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
