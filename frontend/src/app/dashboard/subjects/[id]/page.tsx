"use client";

import { useSubjects } from "@/context/subject-context";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, BookOpen, FileText, BadgeCheck, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SubjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getSubject } = useSubjects();
    const id = params.id as string;

    const subject = getSubject(id);

    if (!subject) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Subject Not Found</h1>
                <Button onClick={() => router.push("/dashboard/subjects")}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <span className="font-medium text-foreground">Class:</span> {subject.class}
                                    {subject.section && <span> - Section {subject.section}</span>}
                                    <span className="mx-2">•</span>
                                    <span className="font-medium text-foreground">Teacher:</span> {subject.teacherName || "Not Assigned"}
                                </p>
                                <div className="mt-2">
                                    <Badge variant={subject.status === "Active" ? "default" : "secondary"}>{subject.status}</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.push(`/dashboard/subjects/${id}/edit`)}>Edit Subject</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="exams">Exams</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Subject Name</h3>
                                <p>{subject.name}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Class & Section</h3>
                                <p>{subject.class} {subject.section ? `(${subject.section})` : "(All Sections)"}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Assigned Teacher</h3>
                                <p>{subject.teacherName || "Not Assigned"}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                <p>{subject.status}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="exams" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduled Exams</CardTitle>
                            <CardDescription>Upcoming and past exams for this subject.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <FileText className="mr-2 h-6 w-6" />
                                No exams scheduled yet.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="results" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Results</CardTitle>
                            <CardDescription>Recent performance in this subject.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <BadgeCheck className="mr-2 h-6 w-6" />
                                No results published.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
