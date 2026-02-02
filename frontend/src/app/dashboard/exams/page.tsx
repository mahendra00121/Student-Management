"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    ClipboardList,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Timer,
    FileText,
    PieChart,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useExams } from "@/context/exam-context";
import { useClasses } from "@/context/class-context";

export default function ExamsListPage() {
    const { exams, deleteExam } = useExams();
    const { classes } = useClasses();

    const [searchTerm, setSearchTerm] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredExams = exams.filter((exam) => {
        const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = classFilter === "all" || exam.classId === classFilter;
        const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
        return matchesSearch && matchesClass && matchesStatus;
    });

    const stats = {
        total: exams.length,
        ongoing: exams.filter(e => e.status === "Ongoing").length,
        upcoming: exams.filter(e => e.status === "Upcoming").length,
        completed: exams.filter(e => e.status === "Completed").length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Upcoming":
                return (
                    <Badge variant="secondary" className="gap-1 rounded-full px-3 py-0.5">
                        <Clock className="h-3 w-3" /> Upcoming
                    </Badge>
                );
            case "Ongoing":
                return (
                    <Badge className="gap-1 rounded-full px-3 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-md shadow-emerald-500/20">
                        <Timer className="h-3 w-3" /> Ongoing
                    </Badge>
                );
            case "Completed":
                return (
                    <Badge variant="outline" className="gap-1 rounded-full px-3 py-0.5 border-2 text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" /> Completed
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Examination Registry</h1>
                    <p className="text-muted-foreground text-sm font-medium">Schedule, coordinate, and track academic assessments across all grades.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <PieChart className="h-4 w-4" /> Performance Stats
                    </Button>
                    <Button asChild className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary h-11 px-6">
                        <Link href="/dashboard/exams/new">
                            <Plus className="h-4 w-4" /> New Examination
                        </Link>
                    </Button>
                </div>
            </header>


            <Card className="border shadow-xl shadow-muted/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/10 border-b pb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by exam title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 rounded-xl border-2"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-[160px] h-11 rounded-xl border-2">
                                    <SelectValue placeholder="Academic Class" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.name}>
                                            Grade {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[160px] h-11 rounded-xl border-2">
                                    <SelectValue placeholder="Session Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Assessment Detail</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Academic Grade</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Timeline</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Status</TableHead>
                                <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredExams.length > 0 ? (
                                filteredExams.map((exam) => (
                                    <TableRow key={exam.id} className="group hover:bg-muted/20 transition-colors border-b last:border-none">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight">{exam.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-1">{exam.type}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-bold border-2 text-xs px-2.5">Grade {exam.classId}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(exam.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                                                    {new Date(exam.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(exam.status)}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Exam Controls</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild className="gap-2 px-3 py-2.5 rounded-lg cursor-pointer">
                                                        <Link href={`/dashboard/exams/${exam.id}`}>
                                                            <Eye className="h-4 w-4 text-primary" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="gap-2 px-3 py-2.5 rounded-lg cursor-pointer">
                                                        <Link href={`/dashboard/exams/${exam.id}/edit`}>
                                                            <Edit className="h-4 w-4 text-amber-500" /> Edit Schedule
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-destructive focus:text-destructive"
                                                        onClick={() => {
                                                            if (confirm("Permanently delete this examination record?")) {
                                                                deleteExam(exam.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center bg-muted/5">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="p-3 bg-muted rounded-full">
                                                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground font-bold tracking-tight">No examinations found matching your criteria.</p>
                                        </div>
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
