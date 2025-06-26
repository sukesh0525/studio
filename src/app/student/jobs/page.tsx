"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Building, Heart } from "lucide-react";
import { JobApplyDialog } from "@/components/job-apply-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const jobs = [
  {
    id: 1,
    company: "Ministry of Technology",
    title: "Junior Software Developer",
    location: "New Delhi",
    type: "Full-time",
    description: "Work on cutting-edge e-governance projects that impact millions of citizens. Seeking passionate developers with a strong foundation in web technologies.",
    followers: 25600,
  },
  {
    id: 2,
    company: "National Health Authority",
    title: "Data Analyst",
    location: "Mumbai",
    type: "Full-time",
    description: "Analyze large datasets to derive insights for public health policies. Experience with Python, R, and SQL is a must.",
    followers: 18300,
  },
  {
    id: 3,
    company: "Defence Research & Development Organisation (DRDO)",
    title: "Cyber Security Trainee",
    location: "Bengaluru",
    type: "Full-time",
    description: "Join the team protecting national digital assets. A great opportunity for fresh graduates to learn from the best in the field.",
    followers: 45000,
  },
  {
    id: 4,
    company: "Indian Space Research Organisation (ISRO)",
    title: "Aerospace Engineering Intern",
    location: "Remote",
    type: "Internship",
    description: "Contribute to India's prestigious space program. This is a remote internship focused on satellite data processing.",
    followers: 98000,
  }
];

export default function StudentJobsPage() {
  const { toast } = useToast();

  const handleFollow = (companyName: string) => {
    toast({
      title: `Followed ${companyName}`,
      description: `You will now receive updates from ${companyName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <p className="text-muted-foreground">Explore career openings in various government departments and affiliated industries.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1"><Building className="h-4 w-4" /> {job.company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</Badge>
                <Badge variant="secondary">{job.type}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4 mt-4">
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Users className="h-4 w-4" />
                  <span>{job.followers.toLocaleString()}</span>
                  <Button variant="outline" size="sm" onClick={() => handleFollow(job.company)}>
                      <Heart className="mr-2 h-4 w-4" /> Follow
                  </Button>
              </div>
              <JobApplyDialog companyName={job.company} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
