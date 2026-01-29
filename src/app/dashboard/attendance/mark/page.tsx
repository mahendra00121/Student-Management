"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClasses } from "@/context/class-context";
import { useStudents } from "@/context/student-context";
import { useAttendance, AttendanceRecord, AttendanceStatus } from "@/context/attendance-context";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Search,
    Save,
    UserCheck,
    UserX,
    Clock,
    FileSpreadsheet,
    GraduationCap,
    School,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MarkAttendancePage() {
    const router = useRouter();
    const { classes } = useClasses();
    const { students } = useStudents();
    const { markAttendance, getAttendanceByDateAndClass } = useAttendance();

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});

    const handleLoadStudents = () => {
        if (!selectedClass) {
            alert("Please select a class");
            return;
        }

        const classStudents = students.filter(s =>
            s.class === selectedClass &&
            (selectedSection ? s.section === selectedSection : true)
        );

        setFilteredStudents(classStudents);

        const existingRecords = getAttendanceByDateAndClass(selectedDate, selectedClass, selectedSection);
        const initialData: Record<string, AttendanceStatus> = {};

        if (existingRecords.length > 0) {
            existingRecords.forEach(r => {
                initialData[r.studentId] = r.status;
            });
        } else {
            classStudents.forEach(s => {
                initialData[s.id] = "Present";
            });
        }
        setAttendanceData(initialData);
    };

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSaveAttendance = () => {
        if (filteredStudents.length === 0) return;

        const records: AttendanceRecord[] = filteredStudents.map(s => ({
            id: Math.random().toString(36).substr(2, 9),
            studentId: s.id,
            studentName: s.name,
            classId: selectedClass,
            section: selectedSection,
            date: selectedDate,
            status: attendanceData[s.id] || "Present",
            markedBy: "Current User"
        }));

        markAttendance(records);
        alert("Attendance saved successfully!");
    };

    const stats = {
        total: filteredStudents.length,
        present: Object.values(attendanceData).filter(s => s === "Present").length,
        absent: Object.values(attendanceData).filter(s => s === "Absent").length,
        late: Object.values(attendanceData).filter(s => s === "Late").length,
    };

    const availableSections = selectedClass
        ? classes.find(c => c.name === selectedClass)?.sections || []
        : [];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Mark Attendance</h1>
                    <p className="text-muted-foreground text-sm font-medium">Capture daily ritual of presence for your academic units.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <FileSpreadsheet className="h-4 w-4" /> Export Sheet
                    </Button>
                </div>
            </header>

            <Card className="border shadow-lg shadow-muted/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-6 border-b">
                    <div className="flex items-center gap-2 mb-1">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary/70">Registry Filters</span>
                    </div>
                    <CardTitle className="text-xl font-bold">Selection Criteria</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Academic Grade</label>
                            <Select onValueChange={setSelectedClass} value={selectedClass}>
                                <SelectTrigger className="rounded-xl border-2 h-11">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.name} className="rounded-lg">
                                            Grade {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Division</label>
                            <Select
                                onValueChange={setSelectedSection}
                                value={selectedSection}
                                disabled={!selectedClass}
                            >
                                <SelectTrigger className="rounded-xl border-2 h-11">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {availableSections.map((sec) => (
                                        <SelectItem key={sec} value={sec} className="rounded-lg">
                                            Section {sec}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Registry Date</label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="rounded-xl border-2 h-11"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20" onClick={handleLoadStudents}>
                                <School className="mr-2 h-4 w-4" /> Fetch Registry
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {filteredStudents.length > 0 && (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 block mb-1">Total Registry</span>
                            <span className="text-2xl font-black">{stats.total}</span>
                        </div>
                        <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 block mb-1">Present</span>
                            <span className="text-2xl font-black text-emerald-600">{stats.present}</span>
                        </div>
                        <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-500/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600/70 block mb-1">Absent</span>
                            <span className="text-2xl font-black text-rose-600">{stats.absent}</span>
                        </div>
                        <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/70 block mb-1">Late</span>
                            <span className="text-2xl font-black text-amber-600">{stats.late}</span>
                        </div>
                    </div>

                    <Card className="border shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-6 pt-6">
                            <div>
                                <CardTitle className="text-xl font-bold">Attendance Registry</CardTitle>
                                <CardDescription className="font-medium">
                                    Grade {selectedClass} • Section {selectedSection || "All"} • {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </CardDescription>
                            </div>
                            <Button onClick={handleSaveAttendance} className="gap-2 font-bold rounded-xl shadow-xl shadow-primary/20 bg-primary px-6 h-11">
                                <Save className="h-4 w-4" /> Commit Changes
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="w-[100px] pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Roll No</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Student Information</TableHead>
                                        <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Mark Presence</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="group hover:bg-muted/30 transition-colors border-b last:border-none">
                                            <TableCell className="font-mono font-bold pl-6 text-sm tabular-nums">#{student.rollNo || student.rollNumber || "00"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-muted">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{student.name}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-0.5">UID: {student.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant={attendanceData[student.id] === "Present" ? "default" : "outline"}
                                                        className={`rounded-lg h-9 w-9 p-0 font-black transition-all ${attendanceData[student.id] === "Present" ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" : "hover:border-emerald-600 hover:text-emerald-600"}`}
                                                        onClick={() => handleStatusChange(student.id, "Present")}
                                                        title="Present"
                                                    >
                                                        {attendanceData[student.id] === "Present" ? <CheckCircle2 className="h-4 w-4" /> : "P"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={attendanceData[student.id] === "Absent" ? "destructive" : "outline"}
                                                        className={`rounded-lg h-9 w-9 p-0 font-black transition-all ${attendanceData[student.id] === "Absent" ? "bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20" : "hover:border-rose-600 hover:text-rose-600"}`}
                                                        onClick={() => handleStatusChange(student.id, "Absent")}
                                                        title="Absent"
                                                    >
                                                        {attendanceData[student.id] === "Absent" ? <UserX className="h-4 w-4" /> : "A"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={attendanceData[student.id] === "Late" ? "secondary" : "outline"}
                                                        className={`rounded-lg h-9 w-9 p-0 font-black transition-all ${attendanceData[student.id] === "Late" ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20" : "hover:border-amber-500 hover:text-amber-500"}`}
                                                        onClick={() => handleStatusChange(student.id, "Late")}
                                                        title="Late"
                                                    >
                                                        {attendanceData[student.id] === "Late" ? <Clock className="h-4 w-4" /> : "L"}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {filteredStudents.length === 0 && selectedClass && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <GraduationCap className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Empty Registry</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2 font-medium">
                        No students were found matching the selected class and division criteria.
                    </p>
                </div>
            )}
        </div>
    );
}
