"use client";

import { useClasses, ClassItem } from "@/context/class-context";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, BookOpen, Calendar, Settings, ArrowLeft } from "lucide-react";
import { useStudents } from "@/context/student-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ClassDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getClass } = useClasses();
    const { students } = useStudents();
    const id = params.id as string;

    const classItem = getClass(id);

    if (!classItem) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Class Not Found</h1>
                <Button onClick={() => router.push("/dashboard/classes")}>Go Back</Button>
            </div>
        );
    }

    const classStudents = students.filter(s => s.class === classItem.name);

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
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-3xl font-bold text-primary">{classItem.name}</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Class {classItem.name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <Users className="h-4 w-4" /> {classStudents.length} Students
                                    <span className="mx-2">•</span>
                                    <span className="font-medium text-foreground">Teacher:</span> {classItem.classTeacherName || "Not Assigned"}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.push(`/dashboard/classes/${id}/edit`)}>Edit Class</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="students" className="w-full">
                <TabsList>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="students" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Students List</CardTitle>
                            <CardDescription>Total {classStudents.length} students enrolled in Class {classItem.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Roll No</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {classStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No students found in this class.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        classStudents.map(student => (
                                            <TableRow key={student.id}>
                                                <TableCell>{student.rollNo}</TableCell>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell><Badge variant="secondary">{student.section}</Badge></TableCell>
                                                <TableCell>
                                                    <Badge variant={student.status === "Active" ? "outline" : "destructive"}>
                                                        {student.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="subjects" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subjects & Teachers</CardTitle>
                            <CardDescription>Subjects taught in this class.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <BookOpen className="mr-2 h-6 w-6" />
                                Subject mapping data not available yet.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="attendance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Attendance</CardTitle>
                            <CardDescription>Attendance overview for this class.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <Calendar className="mr-2 h-6 w-6" />
                                No attendance data logged for this month.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
