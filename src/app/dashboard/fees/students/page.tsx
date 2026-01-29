"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFees, PaymentMode } from "@/context/fee-context";
import { useStudents } from "@/context/student-context";
import { useClasses } from "@/context/class-context";
import {
    Search,
    PlusCircle,
    IndianRupee,
    CreditCard,
    Wallet,
    Banknote,
    ArrowUpRight,
    Filter,
    History,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserCircle,
    Activity,
    Landmark
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentFeesPage() {
    const { studentFeeRecords, addPayment, initializeStudentFee } = useFees();
    const { students } = useStudents();
    const { classes } = useClasses();

    const [searchTerm, setSearchTerm] = useState("");
    const [classFilter, setClassFilter] = useState("all");

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState({
        amount: 0,
        mode: "Cash" as PaymentMode,
        remark: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        students.forEach(student => {
            initializeStudentFee(student.id, student.name, student.class);
        });
    }, [students, initializeStudentFee]);

    const stats = useMemo(() => {
        const total = studentFeeRecords.reduce((acc, r) => acc + r.totalFee, 0);
        const collected = studentFeeRecords.reduce((acc, r) => acc + r.paidAmount, 0);
        const pending = total - collected;
        return { total, collected, pending };
    }, [studentFeeRecords]);

    const filteredRecords = studentFeeRecords.filter(r => {
        const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = classFilter === "all" || r.className === classFilter;
        return matchesSearch && matchesClass;
    });

    const handleOpenPayment = (studentId: string) => {
        const record = studentFeeRecords.find(r => r.studentId === studentId);
        setSelectedStudentId(studentId);
        setPaymentData({
            amount: record?.pendingAmount || 0,
            mode: "Cash",
            remark: "",
            date: new Date().toISOString().split('T')[0]
        });
        setIsPaymentOpen(true);
    };

    const handleSavePayment = () => {
        if (selectedStudentId && paymentData.amount > 0) {
            addPayment(selectedStudentId, {
                amountPaid: Number(paymentData.amount),
                mode: paymentData.mode,
                remark: paymentData.remark,
                date: paymentData.date
            });
            setIsPaymentOpen(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Paid":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full px-3 py-0.5 flex items-center gap-1 w-fit font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Fully Paid
                    </Badge>
                );
            case "Partial":
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full px-3 py-0.5 flex items-center gap-1 w-fit font-bold">
                        <Clock className="h-3 w-3" /> Installment
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 rounded-full px-3 py-0.5 flex items-center gap-1 w-fit font-bold">
                        <AlertCircle className="h-3 w-3" /> Unpaid
                    </Badge>
                );
        }
    };

    const selectedRecord = useMemo(() =>
        studentFeeRecords.find(r => r.studentId === selectedStudentId),
        [selectedStudentId, studentFeeRecords]);

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Institutional Collections</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage student financial obligations and secure real-time payments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <Download className="h-4 w-4" /> Export Ledger
                    </Button>
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <History className="h-4 w-4" /> Payment History
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-none shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Banknote className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary/70">Receivables Projection</CardDescription>
                        <CardTitle className="text-3xl font-black text-primary">₹{stats.total.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-emerald-500/5 border-none shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <IndianRupee className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-black tracking-widest text-emerald-600/70">Aggregated Collections</CardDescription>
                        <CardTitle className="text-3xl font-black text-emerald-600">₹{stats.collected.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-rose-500/5 border-none shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <AlertCircle className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-black tracking-widest text-rose-600/70">Outstanding Dues</CardDescription>
                        <CardTitle className="text-3xl font-black text-rose-600">₹{stats.pending.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border shadow-xl shadow-muted/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/10 border-b pb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by candidate name..."
                                className="pl-10 h-11 rounded-xl border-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-[180px] h-11 rounded-xl border-2">
                                    <Filter className="h-4 w-4 mr-2 opacity-50" />
                                    <SelectValue placeholder="Academic Grade" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Across All Grades</SelectItem>
                                    {classes.map(c => <SelectItem key={c.id} value={c.name}>Grade {c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-6 h-12 uppercase text-[10px] font-black tracking-widest">Candidate Information</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Projection</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Secured</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Balance Due</TableHead>
                                <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Fiscal Status</TableHead>
                                <TableHead className="text-right pr-6 h-12 uppercase text-[10px] font-black tracking-widest">Operations</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((r) => (
                                    <TableRow key={r.studentId} className="group hover:bg-muted/20 transition-colors border-b last:border-none">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-muted">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.studentName}`} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase text-xs">{r.studentName.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{r.studentName}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-1">Grade {r.className}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-bold tabular-nums">₹{r.totalFee.toLocaleString()}</TableCell>
                                        <TableCell className="font-mono text-xs font-bold tabular-nums text-emerald-600">₹{r.paidAmount.toLocaleString()}</TableCell>
                                        <TableCell className="font-mono text-xs font-bold tabular-nums text-rose-600">₹{r.pendingAmount.toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(r.status)}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button
                                                size="sm"
                                                variant={r.status === 'Paid' ? "ghost" : "default"}
                                                onClick={() => handleOpenPayment(r.studentId)}
                                                disabled={r.status === 'Paid'}
                                                className={`rounded-xl font-bold gap-2 px-4 ${r.status !== 'Paid' ? 'shadow-lg shadow-primary/20 bg-primary h-9' : 'text-emerald-600 disabled:opacity-100 hover:bg-transparent'}`}
                                            >
                                                {r.status === 'Paid' ? <CheckCircle2 className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                                                {r.status === 'Paid' ? 'Audited' : 'Process'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center bg-muted/5 py-10">
                                        <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                                            <Wallet className="h-10 w-10" />
                                            <p className="text-sm font-bold tracking-tight">No fiscal data matches your selection.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-primary p-8 text-primary-foreground relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
                        <DialogTitle className="text-2xl font-black tracking-tighter uppercase mb-1">Fiscal Entry</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 font-medium">Capture financial collection for candidate registry.</DialogDescription>
                    </div>

                    <div className="p-8 space-y-6 bg-card">
                        {selectedRecord && (
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-muted-foreground/10">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRecord.studentName}`} />
                                    <AvatarFallback className="bg-primary/20 text-primary">{selectedRecord.studentName.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-black text-sm uppercase tracking-tight">{selectedRecord.studentName}</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground leading-none mt-1">Due Balance: ₹{selectedRecord.pendingAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Registry Date</label>
                                <Input
                                    type="date"
                                    value={paymentData.date}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, date: e.target.value }))}
                                    className="rounded-xl border-2 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Secure Amount</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                        className="pl-8 rounded-xl border-2 h-11 font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Payment Protocol</label>
                            <Select
                                value={paymentData.mode}
                                onValueChange={(v: PaymentMode) => setPaymentData(prev => ({ ...prev, mode: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-2 font-bold text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Cash" className="rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="h-4 w-4" /> Physical Tender (Cash)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="UPI" className="rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4" /> Digital Network (UPI)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Bank" className="rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Landmark className="h-4 w-4" /> Institutional Transfer (Bank)
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Observational Remarks</label>
                            <Input
                                placeholder="Enter auxiliary details or reference IDs..."
                                value={paymentData.remark}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, remark: e.target.value }))}
                                className="rounded-xl border-2 h-11"
                            />
                        </div>
                    </div>

                    <div className="p-8 pt-0 bg-card flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-xl font-bold h-11 border-2" onClick={() => setIsPaymentOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSavePayment} className="flex-1 rounded-xl font-bold h-11 shadow-lg shadow-primary/20 bg-primary">
                            Secure Payment
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
