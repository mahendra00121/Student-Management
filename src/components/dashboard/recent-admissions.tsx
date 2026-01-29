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

const recentAdmissions = [
    {
        name: "John Doe",
        email: "john@example.com",
        class: "10-A",
        date: "2026-01-15",
        status: "Verified",
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        class: "8-B",
        date: "2026-01-14",
        status: "Active",
    },
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        class: "9-C",
        date: "2026-01-12",
        status: "Pending",
    },
    {
        name: "Bob Brown",
        email: "bob@example.com",
        class: "7-A",
        date: "2026-01-10",
        status: "Verified",
    },
    {
        name: "Charlie Davis",
        email: "charlie@example.com",
        class: "6-B",
        date: "2026-01-08",
        status: "Active",
    },
];

export function RecentAdmissions() {
    return (
        <div className="rounded-[2rem] border-none bg-white shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter">Recent Admissions</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1 underline decoration-primary/20 underline-offset-4">Tracking latest 5 institutional enrollments</p>
                </div>
                <Button variant="ghost" className="gap-2 rounded-xl font-bold hover:bg-primary/5 hover:text-primary transition-all group">
                    View Registry <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
            <div className="p-0">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-none">
                            <TableHead className="w-[350px] pl-8 h-14 uppercase text-[10px] font-black tracking-[0.2em]">Candidate Portfolio</TableHead>
                            <TableHead className="h-14 uppercase text-[10px] font-black tracking-[0.2em]">Academic Unit</TableHead>
                            <TableHead className="h-14 text-center uppercase text-[10px] font-black tracking-[0.2em]">Registry Status</TableHead>
                            <TableHead className="text-right pr-8 h-14 uppercase text-[10px] font-black tracking-[0.2em]">Inception Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentAdmissions.map((admission, i) => (
                            <TableRow key={i} className="group hover:bg-primary/5 border-b transition-all duration-300">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-muted/20">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admission.name}`} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">{admission.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-sm tracking-tight group-hover:text-primary transition-colors">{admission.name}</span>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                <Mail className="h-3 w-3" /> {admission.email}
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
                                        className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm ${admission.status === 'Verified' ? 'bg-emerald-500' :
                                                admission.status === 'Active' ? 'bg-blue-500' : 'bg-amber-500'
                                            }`}
                                    >
                                        {admission.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-5 text-right pr-8">
                                    <div className="flex items-center justify-end gap-2 text-muted-foreground font-black text-xs tabular-nums">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {admission.date}
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
