"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useFees } from "@/context/fee-context";
import { useStudents } from "@/context/student-context";
import {
    Wallet,
    History,
    CheckCircle2,
    Clock,
    AlertCircle,
    ReceiptIndianRupee,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function StudentFeeView() {
    const { studentFeeRecords, feeStructures } = useFees();
    const { students } = useStudents();

    // Demo mode: pick first student. In real app, this would be the logged-in student.
    const currentStudent = students[0];
    const record = studentFeeRecords.find(r => r.studentId === currentStudent?.id);
    const structure = feeStructures.find(s => s.className === currentStudent?.class);

    if (!record || !currentStudent) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
                <AlertCircle className="h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">Fee Record Not Found</h2>
                <p>Please contact administration if you think this is an error.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/fees">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
                        <p className="text-muted-foreground">Detailed status of your academic fees and payments</p>
                    </div>
                </div>
                <Badge variant={record.status === 'Paid' ? 'default' : record.status === 'Partial' ? 'secondary' : 'destructive'} className="text-sm px-4 py-1">
                    {record.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Amount</CardDescription>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{record.totalFee.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider">Paid Amount</CardDescription>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{record.paidAmount.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-wider">Remaining</CardDescription>
                        <Clock className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">₹{record.pendingAmount.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ReceiptIndianRupee className="h-5 w-5 text-primary" />
                            Fee Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Tuition Fee</TableCell>
                                    <TableCell className="text-right">₹{structure?.tuitionFee.toLocaleString() || "0"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Examination Fee</TableCell>
                                    <TableCell className="text-right">₹{structure?.examFee.toLocaleString() || "0"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Other Miscellaneous Fees</TableCell>
                                    <TableCell className="text-right">₹{structure?.otherFee.toLocaleString() || "0"}</TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/50">
                                    <TableCell className="font-bold">Total Payable</TableCell>
                                    <TableCell className="text-right font-bold text-primary text-lg">₹{record.totalFee.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            Payment History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Mode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {record.payments.length > 0 ? (
                                    record.payments.map((p, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-sm font-medium">{p.date}</TableCell>
                                            <TableCell className="font-bold text-green-600">₹{p.amountPaid.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px]">{p.mode}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground text-sm">
                                            No payments recorded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
