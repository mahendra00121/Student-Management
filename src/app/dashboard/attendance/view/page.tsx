"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStudents } from "@/context/student-context";
import { useAttendance } from "@/context/attendance-context";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function StudentAttendanceView() {
    const { students } = useStudents();
    const { attendanceRecords } = useAttendance();

    // For demo purposes, allow selecting a student. In a real app, this would be fixed to the logged-in student.
    const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

    const studentInfo = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);

    const studentAttendance = useMemo(() => {
        return attendanceRecords
            .filter(r => r.studentId === selectedStudentId && r.date.startsWith(selectedMonth))
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [attendanceRecords, selectedStudentId, selectedMonth]);

    const stats = useMemo(() => {
        const total = studentAttendance.length;
        const present = studentAttendance.filter(r => r.status === "Present" || r.status === "Late").length;
        const percentage = total > 0 ? (present / total) * 100 : 0;
        return { total, present, percentage };
    }, [studentAttendance]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
                    <p className="text-muted-foreground">View your monthly attendance history</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Student (Demo Mode)</CardTitle>
                    <CardDescription>In production, this would be locked to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Student</label>
                            <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name} ({s.rollNumber})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Month</label>
                            <input
                                type="month"
                                className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {studentInfo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Days Held</p>
                                    <h3 className="text-2xl font-bold">{stats.total}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Days Attended</p>
                                    <h3 className="text-2xl font-bold">{stats.present}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Badge className="text-lg px-3 py-1" variant={stats.percentage >= 75 ? "default" : "destructive"}>
                                        {Math.round(stats.percentage)}%
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Attendance Pct</p>
                                    <h3 className="text-2xl font-bold">{stats.percentage >= 75 ? "Excellent" : "Low"}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Daily Status - {selectedMonth}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentAttendance.length > 0 ? (
                                studentAttendance.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.date}</TableCell>
                                        <TableCell className="text-right">
                                            {record.status === "Present" && (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    Present
                                                </Badge>
                                            )}
                                            {record.status === "Absent" && (
                                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
                                                    Absent
                                                </Badge>
                                            )}
                                            {record.status === "Late" && (
                                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                    Late
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                                        No records found for this month.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
