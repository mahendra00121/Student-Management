"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts";
import {
    Users,
    CalendarCheck,
    TrendingUp,
    AlertTriangle,
    GraduationCap,
    CheckCircle2,
    XCircle,
    IndianRupee,
    History,
    Download,
    Printer,
    Filter,
    Activity,
    FileText,
    ChevronRight,
    Search,
    PieChart as PieChartIcon
} from "lucide-react";

import { useStudents } from "@/context/student-context";
import { useClasses } from "@/context/class-context";
import { useAttendance } from "@/context/attendance-context";
import { useResults } from "@/context/result-context";
import { useExams } from "@/context/exam-context";
import { useFees } from "@/context/fee-context";

export default function ReportsPage() {
    const { students } = useStudents();
    const { classes } = useClasses();
    const { attendanceRecords } = useAttendance();
    const { results } = useResults();
    const { exams } = useExams();
    const { studentFeeRecords } = useFees();

    const [activeTab, setActiveTab] = useState("attendance");
    const [selectedClass, setSelectedClass] = useState("all");
    const [selectedSection, setSelectedSection] = useState("all");
    const [attendanceMonth, setAttendanceMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedExam, setSelectedExam] = useState("all");

    // Memoized Data Processing
    const attendanceData = useMemo(() => {
        let filteredStudents = students;
        if (selectedClass !== "all") filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
        if (selectedSection !== "all") filteredStudents = filteredStudents.filter(s => s.section === selectedSection);

        const summary = filteredStudents.map(student => {
            const studentRecords = attendanceRecords.filter(r =>
                r.studentId === student.id && r.date.startsWith(attendanceMonth)
            );
            const totalDays = Array.from(new Set(attendanceRecords.filter(r => r.date.startsWith(attendanceMonth)).map(r => r.date))).length;
            const present = studentRecords.filter(r => r.status === "Present" || r.status === "Late").length;
            const absent = studentRecords.filter(r => r.status === "Absent").length;
            const percentage = totalDays > 0 ? (present / totalDays) * 100 : 0;

            return { id: student.id, name: student.name, rollNo: student.rollNo, totalDays, present, absent, percentage };
        });

        const avgAttendance = summary.length > 0 ? summary.reduce((acc, s) => acc + s.percentage, 0) / summary.length : 0;
        const lowAttendance = summary.filter(s => s.percentage < 75 && s.totalDays > 0).length;

        return { summary, avgAttendance, lowAttendance, total: filteredStudents.length };
    }, [students, attendanceRecords, attendanceMonth, selectedClass, selectedSection]);

    const academicData = useMemo(() => {
        let list = results;
        if (selectedClass !== "all") list = list.filter(r => r.classId === selectedClass);
        if (selectedExam !== "all") list = list.filter(r => r.examId === selectedExam);

        const total = list.length;
        const passed = list.filter(r => r.status === "Pass").length;
        const failed = list.filter(r => r.status === "Fail").length;
        const passPct = total > 0 ? (passed / total) * 100 : 0;

        return { list, total, passed, failed, passPct };
    }, [results, selectedClass, selectedExam]);

    const feesData = useMemo(() => {
        let list = studentFeeRecords;
        if (selectedClass !== "all") list = list.filter(r => r.className === selectedClass);

        const totalExpected = list.reduce((acc, r) => acc + r.totalFee, 0);
        const totalCollected = list.reduce((acc, r) => acc + r.paidAmount, 0);
        const totalPending = totalExpected - totalCollected;

        return { list, totalExpected, totalCollected, totalPending };
    }, [studentFeeRecords, selectedClass]);

    const handlePrint = () => window.print();

    return (
        <div className="flex flex-col gap-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print px-1">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Institutional Reports</h1>
                    <p className="text-muted-foreground font-medium text-sm">Orchestrate data insights across attendance, academics, and finances.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint} className="rounded-xl border-2 font-bold h-11">
                        <Printer className="mr-2 h-4 w-4" /> Print Registry
                    </Button>
                    <Button className="rounded-xl font-bold h-11 shadow-lg shadow-primary/20">
                        <Download className="mr-2 h-4 w-4" /> Export Ledger
                    </Button>
                </div>
            </header>

            <Card className="no-print border shadow-sm rounded-2xl overflow-hidden mb-2">
                <CardHeader className="bg-muted/30 border-b py-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Filter className="h-3 w-3" /> Parameter Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-6">
                    <div className="flex flex-wrap gap-6">
                        <div className="min-w-[200px] space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Grade Level</label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="rounded-xl border-2 h-11">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Whole Institutional</SelectItem>
                                    {classes.map(c => <SelectItem key={c.id} value={c.name}>Grade {c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="min-w-[200px] space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Functional Section</label>
                            <Select value={selectedSection} onValueChange={setSelectedSection} disabled={selectedClass === "all"}>
                                <SelectTrigger className="rounded-xl border-2 h-11">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {selectedClass !== "all" && classes.find(c => c.name === selectedClass)?.sections.map(s => (
                                        <SelectItem key={s} value={s}>Section {s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="attendance" onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex w-full md:w-auto p-1 bg-muted/50 rounded-2xl mb-8 no-print border overflow-x-auto h-auto no-scrollbar">
                    <TabsTrigger value="attendance" className="flex-1 md:w-[200px] rounded-xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Attendance Analysis</TabsTrigger>
                    <TabsTrigger value="academic" className="flex-1 md:w-[200px] rounded-xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Academic Merit</TabsTrigger>
                    <TabsTrigger value="fees" className="flex-1 md:w-[200px] rounded-xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Financial Health</TabsTrigger>
                </TabsList>

                {/* --- ATTENDANCE TAB --- */}
                <TabsContent value="attendance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center no-print">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold tracking-tight">Persistence Monitoring</h2>
                        </div>
                        <Input
                            type="month"
                            className="w-[220px] rounded-xl border-2 h-11 font-bold"
                            value={attendanceMonth}
                            onChange={(e) => setAttendanceMonth(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-blue-600/5 border-none shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Users className="h-16 w-16" /></div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-blue-600/70">Candidate Registry</CardDescription>
                                <CardTitle className="text-3xl font-black text-blue-600">{attendanceData.total}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="bg-emerald-600/5 border-none shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><CalendarCheck className="h-16 w-16" /></div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">Aggregated Percentile</CardDescription>
                                <CardTitle className="text-3xl font-black text-emerald-600">{Math.round(attendanceData.avgAttendance)}%</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="bg-rose-600/5 border-none shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><AlertTriangle className="h-16 w-16" /></div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-rose-600/70">High-Risk ( &lt; 75% )</CardDescription>
                                <CardTitle className="text-3xl font-black text-rose-600">{attendanceData.lowAttendance}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-muted/5 border-b py-6"><CardTitle className="text-lg font-bold">Engagement Intensity</CardTitle></CardHeader>
                            <CardContent className="h-[350px] pt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={attendanceData.summary}>
                                        <defs>
                                            <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3182ce" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#3182ce', strokeWidth: 2 }}
                                        />
                                        <Area type="monotone" dataKey="percentage" stroke="#3182ce" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-muted/5 border-b py-6"><CardTitle className="text-lg font-bold">Status Composition</CardTitle></CardHeader>
                            <CardContent className="h-[350px] flex items-center justify-center pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Present/Late', value: attendanceData.summary.reduce((a, b) => a + b.present, 0) },
                                                { name: 'Absent', value: attendanceData.summary.reduce((a, b) => a + b.absent, 0) }
                                            ]}
                                            cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b py-6"><CardTitle className="text-xl font-bold">Candidate Participation Ledger</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-none">
                                        <TableHead className="pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Candidate</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Registry UID</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Active Days</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Logged Presence</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Exceptions</TableHead>
                                        <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Intensity Index</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceData.summary.map(s => (
                                        <TableRow key={s.id} className="group hover:bg-muted/20 border-b transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-muted">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} />
                                                        <AvatarFallback className="font-bold text-xs">{s.name.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-sm tracking-tight">{s.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-bold text-muted-foreground">#{s.rollNo}</TableCell>
                                            <TableCell className="text-center font-bold text-sm">{s.totalDays}</TableCell>
                                            <TableCell className="text-center text-emerald-600 font-bold text-sm">{s.present}</TableCell>
                                            <TableCell className="text-center text-rose-500 font-bold text-sm">{s.absent}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge className={`rounded-full px-3 py-0.5 border-none shadow-sm ${s.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                    {Math.round(s.percentage)}%
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ACADEMIC TAB --- */}
                <TabsContent value="academic" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center no-print">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            <h2 className="text-xl font-bold tracking-tight">Merit Performance Data</h2>
                        </div>
                        <Select value={selectedExam} onValueChange={setSelectedExam}>
                            <SelectTrigger className="w-[200px] rounded-xl border-2 h-11 font-bold">
                                <SelectValue placeholder="All Assessments" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">Cumulative Registry</SelectItem>
                                {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="bg-purple-600/5 border-none shadow-none text-center py-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-600/70 mb-1">Evaluated Population</p>
                            <h3 className="text-4xl font-black text-purple-700">{academicData.total}</h3>
                        </Card>
                        <Card className="bg-emerald-600/5 border-none shadow-none text-center py-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 mb-1">Successful Candidacy</p>
                            <h3 className="text-4xl font-black text-emerald-700">{academicData.passed}</h3>
                        </Card>
                        <Card className="bg-rose-600/5 border-none shadow-none text-center py-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/70 mb-1">Deficient Performance</p>
                            <h3 className="text-4xl font-black text-rose-700">{academicData.failed}</h3>
                        </Card>
                        <Card className="bg-primary border-none shadow-xl text-primary-foreground text-center py-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl -mr-12 -mt-12" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Pass Index</p>
                            <h3 className="text-4xl font-black">{Math.round(academicData.passPct)}%</h3>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border shadow-sm rounded-3xl overflow-hidden h-[400px]">
                            <CardHeader className="bg-muted/5 border-b py-6"><CardTitle className="text-lg font-bold">Grade Distribution Curve</CardTitle></CardHeader>
                            <CardContent className="pt-8 h-full pb-20">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { grade: 'A+', count: academicData.list.filter(r => r.finalGrade === 'A+').length },
                                            { grade: 'A', count: academicData.list.filter(r => r.finalGrade === 'A').length },
                                            { grade: 'B', count: academicData.list.filter(r => r.finalGrade === 'B').length },
                                            { grade: 'C', count: academicData.list.filter(r => r.finalGrade === 'C').length },
                                            { grade: 'Fail', count: academicData.list.filter(r => r.finalGrade === 'Fail').length }
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '900' }} />
                                        <YAxis axisLine={false} tickLine={false} hide />
                                        <Tooltip cursor={{ fill: '#F7FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-sm rounded-3xl overflow-hidden h-[400px]">
                            <CardHeader className="bg-muted/5 border-b py-6"><CardTitle className="text-lg font-bold">Qualification Velocity</CardTitle></CardHeader>
                            <CardContent className="pt-8 h-full pb-20">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Qualified', value: academicData.passed },
                                                { name: 'Requires Re-eval', value: academicData.failed }
                                            ]}
                                            cx="50%" cy="50%" outerRadius={110} dataKey="value" labelLine={false} stroke="none" paddingAngle={5}
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b py-6"><CardTitle className="text-xl font-bold">Academic Merit Leaderboard</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-none">
                                        <TableHead className="pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Candidate</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Evaluation</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Score Raw</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Percentile</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Standing</TableHead>
                                        <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Consolidated Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {academicData.list.map(r => (
                                        <TableRow key={r.id} className="group hover:bg-muted/20 border-b transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-muted">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.studentName}`} />
                                                        <AvatarFallback className="font-bold text-xs">{r.studentName.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-sm tracking-tight">{r.studentName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{r.examName}</TableCell>
                                            <TableCell className="text-center font-bold text-sm">{r.totalMarks} / {r.maxTotalMarks}</TableCell>
                                            <TableCell className="text-center font-black text-sm text-primary">{Math.round(r.percentage)}%</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="rounded-xl font-black px-3 py-0.5 border-2 border-primary/20 text-primary">Grade {r.finalGrade}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${r.status === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                                                    <span className={`text-xs font-black uppercase tracking-widest ${r.status === 'Pass' ? 'text-emerald-700' : 'text-rose-700'}`}>{r.status}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- FEES TAB --- */}
                <TabsContent value="fees" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-muted/10 border-none shadow-none p-8 flex flex-col items-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Institutional Projection</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-muted-foreground">₹</span>
                                <h3 className="text-4xl font-black tracking-tighter">{feesData.totalExpected.toLocaleString()}</h3>
                            </div>
                        </Card>
                        <Card className="bg-emerald-500 border-none shadow-xl shadow-emerald-500/20 p-8 flex flex-col items-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Secured Capital</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold opacity-70">₹</span>
                                <h3 className="text-4xl font-black tracking-tighter">{feesData.totalCollected.toLocaleString()}</h3>
                            </div>
                        </Card>
                        <Card className="bg-rose-500 border-none shadow-xl shadow-rose-500/20 p-8 flex flex-col items-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Operational Deficit</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold opacity-70">₹</span>
                                <h3 className="text-4xl font-black tracking-tighter">{feesData.totalPending.toLocaleString()}</h3>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border shadow-sm rounded-3xl overflow-hidden h-[400px]">
                            <CardHeader className="bg-muted/5 border-b py-6"><CardTitle className="text-lg font-bold">Revenue Intake Velocity</CardTitle></CardHeader>
                            <CardContent className="pt-10 h-full pb-20">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[
                                        { month: 'Apr', collected: 50000 }, { month: 'May', collected: 45000 },
                                        { month: 'Jun', collected: 60000 }, { month: 'Jul', collected: 55000 },
                                        { month: 'Aug', collected: feesData.totalCollected / 2 }, { month: 'Sep', collected: feesData.totalCollected }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={5} dot={{ r: 8, strokeWidth: 4, fill: '#fff', stroke: '#10b981' }} activeDot={{ r: 10 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary/5 border-none shadow-none flex flex-col items-center justify-center p-8 rounded-3xl text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"><TrendingUp className="h-10 w-10 text-primary" /></div>
                            <h4 className="text-2xl font-black tracking-tight mb-2">Collection Index</h4>
                            <p className="text-sm font-medium text-muted-foreground px-4 mb-6">The current intake represents a liquidity ratio of over institutional mandates.</p>
                            <div className="text-5xl font-black text-primary transition-all hover:scale-110 cursor-default">
                                {Math.round((feesData.totalCollected / feesData.totalExpected) * 100)}%
                            </div>
                        </Card>
                    </div>

                    <Card className="border shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b py-6"><CardTitle className="text-xl font-bold">Consolidated Fiscal Clearance Registry</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-none">
                                        <TableHead className="pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Candidate</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Grade Level</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Total Liability</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Secured Capital</TableHead>
                                        <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Balanced Dues</TableHead>
                                        <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Fiscal Clearance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feesData.list.map(r => (
                                        <TableRow key={r.studentId} className="group hover:bg-muted/20 border-b transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-muted">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.studentName}`} />
                                                        <AvatarFallback className="font-bold text-xs">{r.studentName.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-sm tracking-tight">{r.studentName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Grade {r.className}</TableCell>
                                            <TableCell className="text-center font-bold text-sm">₹{r.totalFee.toLocaleString()}</TableCell>
                                            <TableCell className="text-center text-emerald-600 font-bold text-sm">₹{r.paidAmount.toLocaleString()}</TableCell>
                                            <TableCell className="text-center text-rose-500 font-bold text-sm">₹{r.pendingAmount.toLocaleString()}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge className={`rounded-xl px-4 py-1 border-none shadow-sm font-black text-[10px] uppercase tracking-widest ${r.status === 'Paid' ? 'bg-emerald-500' : r.status === 'Partial' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                                                    {r.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
