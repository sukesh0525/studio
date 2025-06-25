import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Building, Calendar } from "lucide-react";
import { JobApplyDialog } from "@/components/job-apply-dialog";

const internships = [
  {
    id: 1,
    company: "NITI Aayog",
    title: "Public Policy Intern",
    location: "Remote",
    duration: "3 Months",
    description: "Assist in research and formulation of policy papers on key national issues. Ideal for students in economics, law, or social sciences.",
    applicants: 312,
  },
  {
    id: 2,
    company: "Ministry of External Affairs",
    title: "Diplomatic Research Intern",
    location: "New Delhi",
    duration: "6 Months",
    description: "Support research on international relations and foreign policy. Requires excellent writing and analytical skills.",
    applicants: 189,
  },
  {
    id: 3,
    company: "Prasar Bharati",
    title: "Digital Media Intern",
    location: "Work from Home",
    duration: "4 Months",
    description: "Help manage social media channels and create digital content for India's public broadcaster.",
    applicants: 215,
  },
   {
    id: 4,
    company: "National Informatics Centre (NIC)",
    title: "Web Development Intern",
    location: "Hybrid (Pune)",
    duration: "6 Months",
    description: "Work on developing and maintaining government websites and applications. Strong knowledge of JavaScript frameworks required.",
    applicants: 155,
  }
];

export default function StudentInternshipsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Internship Opportunities</h1>
        <p className="text-muted-foreground">Gain valuable experience with internships in government bodies.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <Card key={internship.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{internship.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1"><Building className="h-4 w-4" /> {internship.company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{internship.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {internship.location}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {internship.duration}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Users className="h-4 w-4" />
                <span>{internship.applicants} applicants</span>
              </div>
              <JobApplyDialog companyName={internship.company} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
