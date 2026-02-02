"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClasses } from "@/context/class-context";
import { useStudents } from "@/context/student-context";
import { useAttendance } from "@/context/attendance-context";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, BarChart3, CalendarDays, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AttendanceReportPage() {
    const router = useRouter();
    const { classes } = useClasses();
    const { students } = useStudents();
    const { attendanceRecords } = useAttendance();

    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [selectedSection, setSelectedSection] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Filtered data for the summary stats (Today)
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];

        let filteredStudentsList = students;
        if (selectedClass !== "all") {
            filteredStudentsList = filteredStudentsList.filter(s => s.class === selectedClass);
        }
        if (selectedSection !== "all") {
            filteredStudentsList = filteredStudentsList.filter(s => s.section === selectedSection);
        }

        const totalStudents = filteredStudentsList.length;

        const todayRecords = attendanceRecords.filter(r =>
            r.date === today &&
            filteredStudentsList.some(s => s.id === r.studentId)
        );

        const present = todayRecords.filter(r => r.status === "Present" || r.status === "Late").length;
        const absent = todayRecords.filter(r => r.status === "Absent").length;
        const percentage = totalStudents > 0 ? (present / totalStudents) * 100 : 0;

        return { totalStudents, present, absent, percentage };
    }, [students, attendanceRecords, selectedClass, selectedSection]);

    // Data for the table (Monthly summary per student)
    const monthlySummary = useMemo(() => {
        let filteredStudentsList = students;
        if (selectedClass !== "all") {
            filteredStudentsList = filteredStudentsList.filter(s => s.class === selectedClass);
        }
        if (selectedSection !== "all") {
            filteredStudentsList = filteredStudentsList.filter(s => s.section === selectedSection);
        }

        return filteredStudentsList.map(student => {
            const studentRecords = attendanceRecords.filter(r =>
                r.studentId === student.id && r.date.startsWith(selectedMonth)
            );

            const totalDays = Array.from(new Set(attendanceRecords.filter(r => r.date.startsWith(selectedMonth)).map(r => r.date))).length;
            const presentDays = studentRecords.filter(r => r.status === "Present" || r.status === "Late").length;
            const absentDays = studentRecords.filter(r => r.status === "Absent").length;
            const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

            return {
                id: student.id,
                name: student.name,
                totalDays,
                presentDays,
                absentDays,
                percentage: attendancePercentage.toFixed(1)
            };
        });
    }, [students, attendanceRecords, selectedClass, selectedSection, selectedMonth]);

    // Data for chart (Attendance % per day in month)
    const chartData = useMemo(() => {
        const datesInMonth = Array.from(new Set(attendanceRecords
            .filter(r => r.date.startsWith(selectedMonth))
            .map(r => r.date)
        )).sort();

        return datesInMonth.map(date => {
            const recordsOnDate = attendanceRecords.filter(r => r.date === date);
            if (selectedClass !== "all") {
                // Filter records to only those in selected class
                const classStudents = students.filter(s => s.class === selectedClass);
                const classRecords = recordsOnDate.filter(r => classStudents.some(cs => cs.id === r.studentId));
                const present = classRecords.filter(r => r.status === "Present" || r.status === "Late").length;
                const total = classRecords.length;
                return {
                    date: date.slice(8, 10), // Day only
                    percentage: total > 0 ? Math.round((present / total) * 100) : 0
                };
            }

            const present = recordsOnDate.filter(r => r.status === "Present" || r.status === "Late").length;
            const total = recordsOnDate.length;
            return {
                date: date.slice(8, 10),
                percentage: total > 0 ? Math.round((present / total) * 100) : 0
            };
        });
    }, [attendanceRecords, selectedMonth, selectedClass, students]);

    const availableSections = selectedClass !== "all"
        ? classes.find(c => c.name === selectedClass)?.sections || []
        : [];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 no-print">
                <Button variant="outline" size="icon" asChild className="rounded-full shadow-sm h-8 w-8">
                    <Link href="/dashboard/attendance">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <span className="text-xs font-bold text-muted-foreground">Return to Intelligence</span>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
                    <p className="text-muted-foreground">Detailed attendance summary and charts</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                                <h3 className="text-2xl font-bold">{stats.present}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                <UserX className="h-6 w-6 text-red-600 dark:text-red-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
                                <h3 className="text-2xl font-bold">{stats.absent}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Attendance %</p>
                                <h3 className="text-2xl font-bold">{Math.round(stats.percentage)}%</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Class</label>
                            <Select onValueChange={setSelectedClass} value={selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.name}>
                                            Class {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Section</label>
                            <Select
                                onValueChange={setSelectedSection}
                                value={selectedSection}
                                disabled={selectedClass === "all"}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {availableSections.map((sec) => (
                                        <SelectItem key={sec} value={sec}>
                                            Section {sec}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Performance</CardTitle>
                        <CardDescription>Attendance percentage trend for {selectedMonth}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.percentage > 75 ? '#10b981' : entry.percentage > 50 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Class Status</CardTitle>
                        <CardDescription>Today's Overview</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px] gap-4">
                        <div className="relative h-40 w-40">
                            <svg className="h-full w-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-muted stroke-current"
                                    strokeWidth="10"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                ></circle>
                                <circle
                                    className="text-primary stroke-current"
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 40}
                                    strokeDashoffset={2 * Math.PI * 40 * (1 - stats.percentage / 100)}
                                    strokeLinecap="round"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    transform="rotate(-90 50 50)"
                                ></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{Math.round(stats.percentage)}%</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Current overall attendance</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">Total Days</TableHead>
                                <TableHead className="text-center">Present Days</TableHead>
                                <TableHead className="text-center">Absent Days</TableHead>
                                <TableHead className="text-right">Attendance %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthlySummary.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell className="text-center">{student.totalDays}</TableCell>
                                    <TableCell className="text-center text-green-600 font-medium">{student.presentDays}</TableCell>
                                    <TableCell className="text-center text-red-500 font-medium">{student.absentDays}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={parseFloat(student.percentage) > 75 ? "default" : "destructive"}>
                                            {student.percentage}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
