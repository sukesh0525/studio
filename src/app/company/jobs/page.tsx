"use client"

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
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

const initialJobs = [
  {
    title: "Senior Policy Advisor",
    status: "Open",
    applicants: 42,
  },
  {
    title: "Cloud Infrastructure Engineer",
    status: "Open",
    applicants: 89,
  },
  {
    title: "Frontend Developer",
    status: "Closed",
    applicants: 153,
  },
];

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [open, setOpen] = useState(false);

  const handleAddJob = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (title) {
        setJobs(prev => [...prev, { title, status: 'Open', applicants: 0}]);
    }
    setOpen(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Manage Job Postings</CardTitle>
          <CardDescription>
            Add new jobs and track applicants for your open positions.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <Input id="title" name="title" className="col-span-3" placeholder="e.g. Software Engineer" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                    Description
                    </Label>
                    <Textarea id="description" name="description" className="col-span-3" placeholder="Job responsibilities, requirements..." />
                </div>
                </div>
                <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
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
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Applicants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>
                  <Badge variant={job.status === "Open" ? "default" : "secondary"} className={job.status === "Open" ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{job.applicants}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
