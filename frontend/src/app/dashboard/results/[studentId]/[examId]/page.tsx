"use client";

import { useParams, useRouter } from "next/navigation";
import { useResults } from "@/context/result-context";
import { useStudents } from "@/context/student-context";
import { useSettings } from "@/context/settings-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, ArrowLeft, School, User, CalendarDays, Award } from "lucide-react";

export default function StudentMarksheetPage() {
    const params = useParams();
    const router = useRouter();
    const { getStudentResult } = useResults();
    const { students } = useStudents();
    const { schoolProfile, academicYear } = useSettings();

    const studentId = params.studentId as string;
    const examId = params.examId as string;

    const result = getStudentResult(studentId, examId);
    const student = students.find(s => s.id === studentId);

    if (!result || !student) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h2 className="text-xl font-semibold">Result not found</h2>
                <Button onClick={() => router.push("/dashboard/results")}>
                    Back to Results
                </Button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-6">
            <div className="flex items-center justify-between no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader className="text-center border-b space-y-4 pb-8">
                    <div className="flex justify-center mb-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <School className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider">{schoolProfile.name}</h1>
                        <p className="text-muted-foreground uppercase text-sm tracking-widest">Academic Year {academicYear.activeYear}</p>
                    </div>
                    <div className="pt-4">
                        <Badge variant="outline" className="text-lg px-6 py-1 rounded-full border-primary text-primary">
                            {result.examName} Report Card
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    {/* Student Info Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-6 border-b border-dashed">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Student Name</p>
                            <p className="font-bold">{result.studentName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Roll Number</p>
                            <p className="font-bold">{result.rollNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Class & Section</p>
                            <p className="font-bold">Class {result.classId} - {result.section || "A"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Student ID</p>
                            <p className="font-bold">#{result.studentId.slice(0, 6).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Marks Table */}
                    <div className="mb-10">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-bold">SUBJECT</TableHead>
                                    <TableHead className="text-center font-bold">MAX MARKS</TableHead>
                                    <TableHead className="text-center font-bold">OBTAINED</TableHead>
                                    <TableHead className="text-right font-bold">GRADE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.marks.map((m, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{m.subjectName}</TableCell>
                                        <TableCell className="text-center">{m.maxMarks}</TableCell>
                                        <TableCell className="text-center font-bold">{m.marksObtained}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-bold ${m.grade === 'Fail' ? 'text-red-500' : 'text-primary'}`}>
                                                {m.grade}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end italic">
                        <div className="space-y-3 bg-muted/30 p-6 rounded-xl border border-dashed text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Total Marks:</span>
                                <span>{result.totalMarks} / {result.maxTotalMarks}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Overall Percentage:</span>
                                <span>{Math.round(result.percentage)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Final Outcome:</span>
                                <Badge variant={result.status === 'Pass' ? 'default' : 'destructive'} className="h-6">
                                    {result.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 p-6">
                            <div className="text-center space-y-1">
                                <div className="text-4xl font-black text-primary">{result.finalGrade}</div>
                                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Final Grade</div>
                            </div>
                            <div className="w-full flex justify-between pt-10 px-4 mt-auto">
                                <div className="border-t border-black w-32 pt-2 text-center text-xs font-bold uppercase">Class Teacher</div>
                                <div className="border-t border-black w-32 pt-2 text-center text-xs font-bold uppercase">Principal</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
