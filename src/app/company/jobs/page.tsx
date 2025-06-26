
"use client";

import { useState } from "react";
import { PlusCircle, ThumbsUp, MessageCircle, PenSquare, Users, View, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialJobs = [
  {
    title: "Senior Policy Advisor",
    status: "Open",
    applicants: 42,
    likes: 120,
    comments: 15,
    image: "https://placehold.co/400x225.png",
    hint: "government building",
    description: "Seeking a seasoned Senior Policy Advisor to lead our strategic initiatives and provide expert guidance on legislative matters. The ideal candidate will have extensive experience in public policy analysis and a proven track record of influencing policy decisions at a national level.",
  },
  {
    title: "Cloud Infrastructure Engineer",
    status: "Open",
    applicants: 89,
    likes: 250,
    comments: 32,
    image: "https://placehold.co/400x225.png",
    hint: "cloud computing",
    description: "Join our team to design, build, and maintain our scalable cloud infrastructure. You will be responsible for deploying and managing cloud services, ensuring high availability, and implementing security best practices. Experience with AWS or Azure is required.",
  },
  {
    title: "Frontend Developer",
    status: "Closed",
    applicants: 153,
    likes: 98,
    comments: 21,
    image: "https://placehold.co/400x225.png",
    hint: "developer code",
    description: "We are looking for a talented Frontend Developer to create beautiful and responsive user interfaces for our public-facing applications. You will work with modern frameworks like React and Next.js to build user-centric features that impact millions of citizens.",
  },
];

const initialUpdates = [
  {
    title: "We're hiring for our new AI division!",
    likes: 56,
    comments: 8,
  },
  {
    title: "Our annual public sector innovation report is out.",
    likes: 212,
    comments: 45,
  },
];

const mockInteractions = {
    likes: [
      { id: 1, name: 'Sonia Sharma', initial: 'SS', image: 'https://placehold.co/40x40.png' },
      { id: 2, name: 'Rajesh Kumar', initial: 'RK', image: 'https://placehold.co/40x40.png' },
      { id: 3, name: 'Anjali Mehta', initial: 'AM', image: 'https://placehold.co/40x40.png' },
      { id: 4, name: 'Rohan Gupta', initial: 'RG', image: 'https://placehold.co/40x40.png' },
    ],
    comments: [
      { id: 1, name: 'Vikram Singh', image: 'https://placehold.co/40x40.png', initial: 'VS', comment: 'This is a fantastic initiative! Really looking forward to the impact it will make.' },
      { id: 2, name: 'Priya Desai', image: 'https://placehold.co/40x40.png', initial: 'PD', comment: 'Great update! Can we get more details on the application process?' },
    ],
};

const mockApplicants = [
  { id: 1, name: 'Aarav Sharma', initial: 'AS', image: 'https://placehold.co/40x40.png', match: '92%' },
  { id: 2, name: 'Diya Patel', initial: 'DP', image: 'https://placehold.co/40x40.png', match: '88%' },
  { id: 3, name: 'Vivaan Reddy', initial: 'VR', image: 'https://placehold.co/40x40.png', match: '85%' },
  { id: 4, name: 'Ishaan Gupta', initial: 'IG', image: 'https://placehold.co/40x40.png', match: '79%' },
];


export default function CompanyDashboardPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [updates, setUpdates] = useState(initialUpdates);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<(typeof initialUpdates)[0] | null>(null);
  const [selectedJob, setSelectedJob] = useState<(typeof initialJobs)[0] | null>(null);

  const handleAddJob = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    if (title) {
      setJobs((prev) => [
        {
          title,
          description: description || "No description provided.",
          status: "Open",
          applicants: 0,
          likes: 0,
          comments: 0,
          image: "https://placehold.co/400x225.png",
          hint: "office team",
        },
        ...prev,
      ]);
    }
    setIsAddJobOpen(false);
  };

  const handleAddUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (title) {
      setUpdates((prev) => [{ title, likes: 0, comments: 0 }, ...prev]);
    }
    setIsAddUpdateOpen(false);
  };

  const handleDeleteJob = (jobIndex: number) => {
    setJobs((prev) => prev.filter((_, index) => index !== jobIndex));
  };

  const handleDeleteUpdate = (updateIndex: number) => {
    setUpdates((prev) => prev.filter((_, index) => index !== updateIndex));
  };

  return (
    <>
    <Tabs defaultValue="jobs" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="jobs">Job Postings</TabsTrigger>
        <TabsTrigger value="updates">Company Updates</TabsTrigger>
      </TabsList>
      <TabsContent value="jobs" className="mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Job Postings</CardTitle>
              <CardDescription>
                Post new jobs and track engagement and applicants.
              </CardDescription>
            </div>
            <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  Add Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddJob}>
                  <DialogHeader>
                    <DialogTitle>Add a New Job Posting</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new position.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Job Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        className="col-span-3"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        className="col-span-3"
                        placeholder="Job responsibilities, requirements..."
                      />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        className="col-span-3"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Post Job</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, index) => (
                    <Card key={index} className="flex flex-col overflow-hidden">
                        <div className="aspect-video relative">
                            <Image
                                src={job.image}
                                alt={job.title}
                                fill
                                className="object-cover"
                                data-ai-hint={job.hint}
                            />
                        </div>
                        <div className="p-4 flex flex-col flex-grow relative">
                             <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                             <Badge variant={job.status === "Open" ? "default" : "secondary"} className="w-fit mb-4">
                                {job.status}
                             </Badge>
                             <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                <div className="flex items-center gap-1.5" title="Applicants">
                                    <Users className="h-4 w-4" />
                                    <span>{job.applicants}</span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Likes">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{job.likes}</span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Comments">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{job.comments}</span>
                                </div>
                            </div>

                             <div className="flex-grow" />
                             
                            <div className="absolute bottom-4 right-4 flex items-center gap-1">
                              <Button 
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedJob(job)}
                                  className="text-primary hover:bg-primary/10"
                                  aria-label="Open job details"
                              >
                                  <View className="h-5 w-5" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    aria-label="Delete job"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this job posting.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteJob(index)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="updates" className="mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Company Updates</CardTitle>
              <CardDescription>
                Post updates, news, and articles for potential candidates.
              </CardDescription>
            </div>
            <Dialog open={isAddUpdateOpen} onOpenChange={setIsAddUpdateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PenSquare className="mr-2" />
                  Create Update
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddUpdate}>
                  <DialogHeader>
                    <DialogTitle>Create a New Update</DialogTitle>
                    <DialogDescription>
                      Share news or insights with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="update-title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="update-title"
                        name="title"
                        className="col-span-3"
                        placeholder="e.g. Annual Report Highlights"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="update-content" className="text-right">
                        Content
                      </Label>
                      <Textarea
                        id="update-content"
                        name="content"
                        className="col-span-3"
                        placeholder="Write your update here..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Post Update</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Post Title</TableHead>
                  <TableHead className="w-[20%] text-center">Stats</TableHead>
                  <TableHead className="w-[20%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {updates.map((update, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {update.title}
                    </TableCell>
                     <TableCell>
                         <button
                            className="flex items-center justify-center gap-6 text-muted-foreground w-full hover:bg-muted p-2 rounded-md transition-colors"
                            onClick={() => setSelectedUpdate(update)}
                          >
                            <div className="flex items-center gap-2" title="Likes">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{update.likes}</span>
                            </div>
                            <div className="flex items-center gap-2" title="Comments">
                                <MessageCircle className="h-4 w-4" />
                                <span>{update.comments}</span>
                            </div>
                        </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="Delete update">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this company update.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUpdate(index)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    
    <Dialog open={!!selectedUpdate} onOpenChange={(open) => !open && setSelectedUpdate(null)}>
        <DialogContent className="sm:max-w-md">
         {selectedUpdate && (
            <>
              <DialogHeader>
                <DialogTitle>Interactions for "{selectedUpdate.title}"</DialogTitle>
                <DialogDescription>
                  See who liked and commented on your update.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="likes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="likes">Likes ({selectedUpdate.likes})</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({selectedUpdate.comments})</TabsTrigger>
                </TabsList>
                <TabsContent value="likes" className="mt-4 max-h-80 overflow-y-auto">
                  <div className="space-y-4">
                    {mockInteractions.likes.map(like => (
                      <div key={like.id} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={like.image} alt={like.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{like.initial}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{like.name}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="mt-4 max-h-80 overflow-y-auto">
                   <div className="space-y-6">
                    {mockInteractions.comments.map(comment => (
                      <div key={comment.id} className="flex items-start gap-4">
                         <Avatar>
                          <AvatarImage src={comment.image} alt={comment.name} data-ai-hint="person portrait"/>
                          <AvatarFallback>{comment.initial}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{comment.name}</p>
                          <p className="text-sm text-muted-foreground">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setSelectedUpdate(null)}>
                    Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
    </Dialog>

    <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-2xl">
         {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
                <DialogDescription>
                  <Badge variant={selectedJob.status === "Open" ? "default" : "secondary"}>
                    {selectedJob.status}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[calc(80vh-10rem)] overflow-y-auto pr-2 space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                        src={selectedJob.image}
                        alt={selectedJob.title}
                        fill
                        className="object-cover"
                        data-ai-hint={selectedJob.hint}
                    />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Job Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                </div>

                <Tabs defaultValue="applicants" className="w-full pt-4">
                    <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="applicants">Applicants ({selectedJob.applicants})</TabsTrigger>
                    <TabsTrigger value="likes">Likes ({selectedJob.likes})</TabsTrigger>
                    <TabsTrigger value="comments">Comments ({selectedJob.comments})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="applicants" className="mt-4 max-h-60 overflow-y-auto">
                    <div className="space-y-4">
                        {mockApplicants.map(applicant => (
                        <div key={applicant.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                <AvatarImage src={applicant.image} alt={applicant.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{applicant.initial}</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">{applicant.name}</p>
                            </div>
                            <Badge variant="secondary">Match: {applicant.match}</Badge>
                        </div>
                        ))}
                    </div>
                    </TabsContent>
                    <TabsContent value="likes" className="mt-4 max-h-60 overflow-y-auto">
                    <div className="space-y-4">
                        {mockInteractions.likes.map(like => (
                        <div key={like.id} className="flex items-center gap-4">
                            <Avatar>
                            <AvatarImage src={like.image} alt={like.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{like.initial}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{like.name}</p>
                        </div>
                        ))}
                    </div>
                    </TabsContent>
                    <TabsContent value="comments" className="mt-4 max-h-60 overflow-y-auto">
                    <div className="space-y-6">
                        {mockInteractions.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-4">
                            <Avatar>
                            <AvatarImage src={comment.image} alt={comment.name} data-ai-hint="person portrait"/>
                            <AvatarFallback>{comment.initial}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                            <p className="font-medium">{comment.name}</p>
                            <p className="text-sm text-muted-foreground">{comment.comment}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setSelectedJob(null)}>
                    Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
    </Dialog>
    </>
  );
}
