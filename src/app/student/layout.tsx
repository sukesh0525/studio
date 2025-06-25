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
import { User, Briefcase, BookUser, Bot, LogOut } from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, this would come from user data
  const isProfileComplete = true;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <GovConnectLogo className="size-8 text-sidebar-foreground" />
            <span className="text-lg font-semibold font-headline">GovConnect</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/student/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild disabled={!isProfileComplete} tooltip={!isProfileComplete ? "Complete your profile to access" : undefined}>
                <Link href="/student/jobs">
                  <Briefcase />
                  <span>Jobs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild disabled={!isProfileComplete} tooltip={!isProfileComplete ? "Complete your profile to access" : undefined}>
                <Link href="/student/internships">
                  <BookUser />
                  <span>Internships</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/student/ai-resume-maker">
                  <Bot />
                  <span>AI Resume Maker</span>
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
           <SidebarTrigger className="md:hidden" />
           <h2 className="text-lg font-semibold font-headline">Student Dashboard</h2>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
