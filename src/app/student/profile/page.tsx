"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters."),
  motherName: z.string().min(2, "Mother's name must be at least 2 characters."),
  college: z.string().min(3, "College name is required."),
  education: z.string().min(10, "Please provide your education details."),
  interest: z.string().min(5, "Please specify your area of interest."),
  linkedIn: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

export default function StudentProfilePage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      motherName: "",
      college: "",
      education: "",
      interest: "",
      linkedIn: "",
      github: "",
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Profile</CardTitle>
        <CardDescription>
          Complete your profile to unlock job and internship opportunities. This information will be used to match you with the best roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College/University Name</FormLabel>
                    <FormControl>
                      <Input placeholder="National Institute of Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Robert Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Maria Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., B.Tech in Computer Science, 2020-2024, 8.5 GPA..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Include your degree, major, graduation year, and GPA.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area of Interest</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Public Policy, Data Science, Software Development..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Mention the fields you are passionate about.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormItem>
                  <FormLabel>Your Resume</FormLabel>
                  <FormControl>
                    <Input type="file" />
                  </FormControl>
                   <FormDescription>Upload your latest resume (PDF, DOCX).</FormDescription>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Certificates</FormLabel>
                  <FormControl>
                    <Input type="file" multiple />
                  </FormControl>
                  <FormDescription>Upload any relevant certificates.</FormDescription>
                  <FormMessage />
                </FormItem>
            </div>


            <Button type="submit">Save Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
