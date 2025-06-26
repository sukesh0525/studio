"use client";

import { useState } from "react";
import { PlusCircle, ThumbsUp, MessageCircle, PenSquare, Users } from "lucide-react";
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

const initialJobs = [
  {
    title: "Senior Policy Advisor",
    status: "Open",
    applicants: 42,
    likes: 120,
    comments: 15,
  },
  {
    title: "Cloud Infrastructure Engineer",
    status: "Open",
    applicants: 89,
    likes: 250,
    comments: 32,
  },
  {
    title: "Frontend Developer",
    status: "Closed",
    applicants: 153,
    likes: 98,
    comments: 21,
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

export default function CompanyDashboardPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [updates, setUpdates] = useState(initialUpdates);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);

  const handleAddJob = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (title) {
      setJobs((prev) => [
        ...prev,
        { title, status: "Open", applicants: 0, likes: 0, comments: 0 },
      ]);
    }
    setIsAddJobOpen(false);
  };

  const handleAddUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (title) {
      setUpdates((prev) => [...prev, { title, likes: 0, comments: 0 }]);
    }
    setIsAddUpdateOpen(false);
  };

  return (
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Stats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={job.status === "Open" ? "default" : "secondary"}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2" title="Applicants">
                          <Users className="h-4 w-4" />
                          <span>{job.applicants}</span>
                        </div>
                        <div className="flex items-center gap-2" title="Likes">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{job.likes}</span>
                        </div>
                        <div className="flex items-center gap-2" title="Comments">
                          <MessageCircle className="h-4 w-4" />
                          <span>{job.comments}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <TableHead className="w-[70%]">Post Title</TableHead>
                  <TableHead className="text-center">Stats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {updates.map((update, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {update.title}
                    </TableCell>
                     <TableCell>
                        <div className="flex items-center justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2" title="Likes">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{update.likes}</span>
                            </div>
                            <div className="flex items-center gap-2" title="Comments">
                                <MessageCircle className="h-4 w-4" />
                                <span>{update.comments}</span>
                            </div>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
