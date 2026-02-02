"use client";

import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, UserCheck, GraduationCap, Mail, ArrowRight } from "lucide-react";
import { useStudents } from "@/context/student-context";

export function RecentAdmissions() {
    const { students } = useStudents();

    // Get the most recent 5 students (assuming they are already sorted by created_at in context, 
    // or we take the first 5 if they are reversed)
    const recentAdmissions = students.slice(0, 5);

    if (students.length === 0) {
        return (
            <div className="rounded-[2rem] border-none bg-white shadow-2xl shadow-primary/5 overflow-hidden p-20 text-center">
                <div className="flex flex-col items-center gap-4 opacity-40">
                    <UserCheck className="h-12 w-12" />
                    <p className="text-lg font-black tracking-tight">No students enrolled yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[2rem] border-none bg-white shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter">Recent Admissions</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1 underline decoration-primary/20 underline-offset-4">Tracking latest {recentAdmissions.length} institutional enrollments</p>
                </div>
                <Button asChild variant="ghost" className="gap-2 rounded-xl font-bold hover:bg-primary/5 hover:text-primary transition-all group">
                    <Link href="/dashboard/students">
                        View Registry <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>
            <div className="p-0">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-none">
                            <TableHead className="w-[350px] pl-8 h-14 uppercase text-[10px] font-black tracking-[0.2em]">Candidate Portfolio</TableHead>
                            <TableHead className="h-14 uppercase text-[10px] font-black tracking-[0.2em]">Academic Unit</TableHead>
                            <TableHead className="h-14 text-center uppercase text-[10px] font-black tracking-[0.2em]">Registry Status</TableHead>
                            <TableHead className="text-right pr-8 h-14 uppercase text-[10px] font-black tracking-[0.2em]">Contact</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentAdmissions.map((admission, i) => (
                            <TableRow key={admission.id || i} className="group hover:bg-primary/5 border-b transition-all duration-300">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-muted/20">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admission.name}`} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">{admission.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full ${admission.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-sm tracking-tight group-hover:text-primary transition-colors">{admission.name}</span>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                <Mail className="h-3 w-3" /> {admission.email || "No email provided"}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-5">
                                    <Badge variant="outline" className="rounded-xl border-2 font-black py-1 px-3 bg-blue-50/50 text-blue-700 border-blue-100/50">
                                        Grade {admission.class}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-5 text-center">
                                    <Badge
                                        className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm ${admission.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                    >
                                        {admission.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-5 text-right pr-8">
                                    <div className="flex items-center justify-end gap-2 text-muted-foreground font-black text-xs tabular-nums">
                                        {admission.phone}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
