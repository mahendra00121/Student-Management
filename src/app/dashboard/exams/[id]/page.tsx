"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    BookOpen,
    Users,
    FileText,
    ArrowLeft,
    Plus,
    Edit
} from "lucide-react";
import { useExams } from "@/context/exam-context";
import { useStudents } from "@/context/student-context";

export default function ExamDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getExam } = useExams();
    const { students } = useStudents();

    const exam = getExam(id as string);

    if (!exam) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h2 className="text-xl font-semibold">Exam not found</h2>
                <Button onClick={() => router.push("/dashboard/exams")}>
                    Back to Exams
                </Button>
            </div>
        );
    }

    const eligibleStudents = students.filter(s => s.class === exam.classId);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/exams")} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{exam.name}</h1>
                    <p className="text-muted-foreground">{exam.type} Examination - Class {exam.classId}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/exams/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Exam
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Start Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-2xl font-bold">{exam.startDate}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">End Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-2xl font-bold">{exam.endDate}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className={
                            exam.status === "Ongoing"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : ""
                        }>
                            {exam.status}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="students">Eligibility</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Subject-wise Schedule</CardTitle>
                                <CardDescription>Detailed timetable for each subject</CardDescription>
                            </div>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Add Subject
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead className="text-center">Max Marks</TableHead>
                                        <TableHead className="text-center">Min Passing</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exam.subjects.length > 0 ? (
                                        exam.subjects.map((sub, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{sub.subjectName}</TableCell>
                                                <TableCell>{sub.date}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Clock className="h-3 w-3" />
                                                        {sub.startTime} - {sub.endTime}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{sub.maxMarks}</TableCell>
                                                <TableCell className="text-center">{sub.passingMarks}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No subjects scheduled yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Eligible Students</CardTitle>
                            <CardDescription>Students from Class {exam.classId}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Roll No</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {eligibleStudents.length > 0 ? (
                                        eligibleStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>{student.rollNumber}</TableCell>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Verified</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                No students found in this class.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Result Status</CardTitle>
                            <CardDescription>Overview of evaluation and publishing</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
                            <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                            <div className="text-center">
                                <h3 className="text-lg font-medium">Evaluation in Progress</h3>
                                <p className="text-sm text-muted-foreground">Results are not yet published for this exam.</p>
                            </div>
                            <Button disabled>View Results</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
