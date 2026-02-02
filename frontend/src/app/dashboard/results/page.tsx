"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useResults } from "@/context/result-context";
import { useClasses } from "@/context/class-context";
import { useExams } from "@/context/exam-context";
import {
    Users,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Eye,
    Download,
    Printer,
    FileSpreadsheet,
    Award,
    Activity,
    LineChart,
    ChevronRight,
    Search,
    UserCircle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ResultsSummaryPage() {
    const { results, getExamResults } = useResults();
    const { classes } = useClasses();
    const { exams } = useExams();

    const [selectedExam, setSelectedExam] = useState<string>("all");
    const [selectedClass, setSelectedClass] = useState<string>("all");

    const filteredResults = useMemo(() => {
        let list = [...results];
        if (selectedExam !== "all") list = list.filter(r => r.examId === selectedExam);
        if (selectedClass !== "all") list = list.filter(r => r.classId === selectedClass);
        return list;
    }, [results, selectedExam, selectedClass]);

    const stats = useMemo(() => {
        const total = filteredResults.length;
        const passed = filteredResults.filter(r => r.status === "Pass").length;
        const failed = filteredResults.filter(r => r.status === "Fail").length;
        const passPct = total > 0 ? (passed / total) * 100 : 0;
        return { total, passed, failed, passPct };
    }, [filteredResults]);

    const chartData = [
        { name: "Passed", value: stats.passed, color: "#10b981" },
        { name: "Failed", value: stats.failed, color: "#ef4444" }
    ];

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Academic Outcomes</h1>
                    <p className="text-muted-foreground text-sm font-medium">Comprehensive analysis of student performance across institutional evaluations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <Printer className="h-4 w-4" /> Batch Print
                    </Button>
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                    <Button asChild className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary h-11 px-6">
                        <Link href="/dashboard/results/entry">
                            <FileSpreadsheet className="h-4 w-4" /> Marks Entry
                        </Link>
                    </Button>
                </div>
            </header>


            <Card className="border shadow-lg shadow-muted/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/10 border-b pb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-[300px] space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Examination Hub</label>
                            <Select onValueChange={setSelectedExam} value={selectedExam}>
                                <SelectTrigger className="h-11 rounded-xl border-2">
                                    <SelectValue placeholder="Select Exam" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Institutional Exams</SelectItem>
                                    {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-[300px] space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Grade Level</label>
                            <Select onValueChange={setSelectedClass} value={selectedClass}>
                                <SelectTrigger className="h-11 rounded-xl border-2">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Across All Classes</SelectItem>
                                    {classes.map(c => <SelectItem key={c.id} value={c.name}>Grade {c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden">
                    <CardHeader className="border-b bg-muted/20 pb-6 pt-6">
                        <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary/70">Merit Registry</span>
                        </div>
                        <CardTitle className="text-xl font-bold">Candidate Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Candidate</TableHead>
                                    <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Roll No</TableHead>
                                    <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Score</TableHead>
                                    <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Percentile</TableHead>
                                    <TableHead className="text-center h-12 uppercase text-[10px] font-black tracking-widest">Standing</TableHead>
                                    <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Report</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((res) => (
                                        <TableRow key={res.id} className="group hover:bg-muted/30 transition-colors border-b last:border-none">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-muted">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${res.studentName}`} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">{res.studentName.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{res.studentName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-bold tabular-nums text-muted-foreground">#{res.rollNumber}</TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-black text-sm">{res.totalMarks}</span>
                                                <span className="text-[10px] text-muted-foreground ml-1">/ {res.maxTotalMarks}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-sm">{Math.round(res.percentage)}%</span>
                                                    <div className="w-12 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className={`h-full ${res.percentage >= 40 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${res.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={res.status === "Pass" ? "default" : "destructive"}
                                                    className={`rounded-full px-3 py-0 border-none shadow-sm ${res.status === "Pass" ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                >
                                                    Grade {res.finalGrade}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" asChild>
                                                    <Link href={`/dashboard/results/${res.studentId}/${res.examId}`}>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center bg-muted/5 py-10">
                                            <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                                                <LineChart className="h-10 w-10" />
                                                <p className="text-sm font-bold tracking-tight">No academic data matches your selection.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-8">
                    <Card className="border shadow-xl shadow-muted/50 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" /> Outcome Distribution
                            </CardTitle>
                            <CardDescription>Overall pass vs failure analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-6">
                            {stats.total > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-30 gap-2">
                                    <Activity className="h-8 w-8" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-center">Dataset Required</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary border-none shadow-2xl shadow-primary/20 rounded-3xl text-primary-foreground overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Academic Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-primary-foreground/80 leading-relaxed font-medium">
                                The current data indicates a <span className="text-white font-black underline decoration-2 underline-offset-4">{Math.round(stats.passPct)}% success rate</span>.
                                Consider implementing intervention strategies for failing candidates in {selectedClass !== "all" ? `Grade ${selectedClass}` : "high-priority grades"}.
                            </p>
                            <Button variant="secondary" className="w-full mt-6 rounded-xl font-bold gap-2">
                                Generate Smart Report <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
