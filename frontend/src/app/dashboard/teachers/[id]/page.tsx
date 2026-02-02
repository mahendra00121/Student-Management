"use client";

import { useTeachers } from "@/context/teacher-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, BadgeCheck, FileText, Briefcase, BookOpen, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TeacherDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getTeacher } = useTeachers();
    const id = params.id as string;

    const teacher = getTeacher(id);

    if (!teacher) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Teacher Not Found</h1>
                <p>The teacher with ID {id} does not exist.</p>
                <Button onClick={() => router.push("/dashboard/teachers")}>Go Back</Button>
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
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`/avatars/${teacher.id}.png`} />
                                <AvatarFallback className="text-2xl">{teacher.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{teacher.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Employee ID: {teacher.employeeId}</span>
                                    <span>•</span>
                                    <Badge variant={teacher.status === "Active" ? "default" : "destructive"}>{teacher.status}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {teacher.phone}</span>
                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {teacher.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.push(`/dashboard/teachers/${id}/edit`)}>Edit Profile</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="classes" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="classes">Assigned Classes</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance Summary</TabsTrigger>
                    <TabsTrigger value="results">Exams & Results</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                                <p>{teacher.name}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Employee ID</h3>
                                <p>{teacher.employeeId}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p>{teacher.email}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Contact Number</h3>
                                <p>{teacher.phone}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Subjects</h3>
                                <div className="flex gap-2 mt-1">
                                    {teacher.subjects.map(sub => <Badge key={sub} variant="secondary">{sub}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="classes" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Classes</CardTitle>
                            <CardDescription>Courses and classes currently assigned to this teacher.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead>Subject</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teacher.classes.map((clsStr, index) => {
                                        // Mock parsing "10-A" to Class 10, Section A
                                        const [cls, sec] = clsStr.split("-");
                                        // Mock subject assignment logic (displaying all subjects for all classes for simplicity)
                                        const subjects = teacher.subjects.join(", ");
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{cls || clsStr}</TableCell>
                                                <TableCell>{sec || "-"}</TableCell>
                                                <TableCell>{subjects}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="attendance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Record</CardTitle>
                            <CardDescription>Monthly attendance overview.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <BadgeCheck className="mr-2 h-6 w-6" />
                                No attendance records found.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="results" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Examination Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <FileText className="mr-2 h-6 w-6" />
                                No exam results found managed by this teacher.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
