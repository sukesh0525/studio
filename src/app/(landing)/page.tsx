import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, User, CheckCircle2, Unlock, Lightbulb, Building2 } from "lucide-react";
import { GovConnectLogo } from "@/components/govconnect-logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center z-20 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-2">
          <GovConnectLogo className="h-8 w-8" />
          <h1 className="text-xl font-bold text-primary">GovConnect</h1>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="text-center relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Forge Your Future in the Public Sector
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            Discover a universe of opportunities where innovation meets public service. GovConnect is your launchpad for a meaningful career that shapes tomorrow. Connect, innovate, and lead.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-5xl mx-auto my-16">
            {/* Graduate Circle */}
            <div className="relative flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-primary/20 via-background to-background rounded-full w-80 h-80 md:w-96 md:h-96 border-2 border-primary/30 shadow-2xl shadow-primary/20 transition-all duration-300 transform hover:scale-105 hover:shadow-primary/40">
              <User className="h-16 w-16 text-primary mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
              <h3 className="text-3xl font-bold text-foreground mb-3">For Graduates</h3>
              <ul className="text-sm text-primary/80 mb-6 max-w-[240px] space-y-1.5 text-left">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary/50" /><span>AI-Powered Resume Builder</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary/50" /><span>Personalized Job Matching</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary/50" /><span>Internship Opportunities</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary/50" /><span>Daily Sector News</span></li>
              </ul>
              <Link href="/student-login">
                <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6 group">
                  Start Your Journey <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Company Circle */}
            <div className="relative flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-accent/20 via-background to-background rounded-full w-80 h-80 md:w-96 md:h-96 border-2 border-accent/30 shadow-2xl shadow-accent/20 transition-all duration-300 transform hover:scale-105 hover:shadow-accent/40">
              <Briefcase className="h-16 w-16 text-accent mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
              <h3 className="text-3xl font-bold text-foreground mb-3">For Companies</h3>
              <ul className="text-sm text-accent/80 mb-6 max-w-[240px] space-y-1.5 text-left">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent/50" /><span>Post Job Openings</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent/50" /><span>AI Resume Analyzer</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent/50" /><span>Discover Top Talent</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent/50" /><span>Showcase Company Culture</span></li>
              </ul>
              <Link href="/company-login">
                <Button variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full px-6 group">
                  Find Talent <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-6xl mx-auto my-24 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Why GovConnect?</h3>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Unlock className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">Unlock Potential</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  We connect ambitious graduates with transformative roles where they can apply their skills, grow as professionals, and make a real-world impact from day one.
                </p>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
                 <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Lightbulb className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="text-xl font-semibold">Drive Innovation</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  Be at the forefront of public sector innovation. Work on cutting-edge projects that leverage technology to solve complex challenges and improve citizen services.
                </p>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                 <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">Build the Nation</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  Your work contributes directly to the growth and prosperity of India. Join a community of leaders dedicated to public service and national development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground z-10 border-t border-border">
        © {new Date().getFullYear()} GovConnect. All Rights Reserved.
      </footer>
    </div>
  );
}
