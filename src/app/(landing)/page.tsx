import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, User } from "lucide-react";
import { GovConnectLogo } from "@/components/govconnect-logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center z-10 border-b border-border">
        <div className="flex items-center gap-2">
          <GovConnectLogo className="h-8 w-8" />
          <h1 className="text-xl font-bold text-primary">GovConnect</h1>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-primary">
            Your Gateway to Public Sector Careers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            GovConnect bridges the gap between aspiring talent and opportunities in government and public sector industries. Find your path, or find the best candidates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-secondary/50 hover:bg-secondary/80 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-accent" />
                  For Students
                </CardTitle>
                <CardDescription>
                  Create your profile, build a professional resume with AI, and find jobs or internships that match your skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/student-login">
                  <Button className="w-full">
                    Start Your Journey <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 hover:bg-secondary/80 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="text-accent" />
                  For Companies
                </CardTitle>
                <CardDescription>
                  Post job openings, manage applications, and discover the next generation of public sector leaders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/company-login">
                  <Button className="w-full">
                    Find Talent <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground z-10 border-t border-border">
        © {new Date().getFullYear()} GovConnect. All Rights Reserved.
      </footer>
    </div>
  );
}
