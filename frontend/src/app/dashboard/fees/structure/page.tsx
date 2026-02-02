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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useFees, FeeStructure } from "@/context/fee-context";
import { useClasses } from "@/context/class-context";
import { Trash2, Edit, Plus, IndianRupee, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function FeeStructurePage() {
    const { feeStructures, addFeeStructure, updateFeeStructure, deleteFeeStructure } = useFees();
    const { classes } = useClasses();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        className: "",
        tuitionFee: 0,
        examFee: 0,
        otherFee: 0
    });

    const handleOpen = (structure?: FeeStructure) => {
        if (structure) {
            setEditingId(structure.id);
            setFormData({
                className: structure.className,
                tuitionFee: structure.tuitionFee,
                examFee: structure.examFee,
                otherFee: structure.otherFee
            });
        } else {
            setEditingId(null);
            setFormData({ className: "", tuitionFee: 0, examFee: 0, otherFee: 0 });
        }
        setIsOpen(true);
    };

    const handleSave = () => {
        const totalFee = Number(formData.tuitionFee) + Number(formData.examFee) + Number(formData.otherFee);
        const data = { ...formData, totalFee };

        if (editingId) {
            updateFeeStructure(editingId, data);
        } else {
            addFeeStructure(data);
        }
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/fees">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Fee Structure</h1>
                        <p className="text-muted-foreground">Define and manage fees for each class</p>
                    </div>
                </div>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Structure
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Tuition Fee</TableHead>
                                <TableHead>Exam Fee</TableHead>
                                <TableHead>Other Fee</TableHead>
                                <TableHead className="font-bold">Total Fee</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feeStructures.length > 0 ? (
                                feeStructures.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">Class {s.className}</TableCell>
                                        <TableCell>₹{s.tuitionFee.toLocaleString()}</TableCell>
                                        <TableCell>₹{s.examFee.toLocaleString()}</TableCell>
                                        <TableCell>₹{s.otherFee.toLocaleString()}</TableCell>
                                        <TableCell className="font-bold text-primary">₹{s.totalFee.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpen(s)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteFeeStructure(s.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No fee structures defined.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Fee Structure" : "Add Fee Structure"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Class</label>
                            <Select
                                value={formData.className}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, className: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => (
                                        <SelectItem key={c.id} value={c.name}>Class {c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tuition Fee</label>
                                <Input
                                    type="number"
                                    value={formData.tuitionFee}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tuitionFee: Number(e.target.value) }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Exam Fee</label>
                                <Input
                                    type="number"
                                    value={formData.examFee}
                                    onChange={(e) => setFormData(prev => ({ ...prev, examFee: Number(e.target.value) }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Other Fees</label>
                            <Input
                                type="number"
                                value={formData.otherFee}
                                onChange={(e) => setFormData(prev => ({ ...prev, otherFee: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                            <span className="font-semibold text-sm">Total Fee:</span>
                            <span className="text-xl font-bold text-primary">₹{(formData.tuitionFee + formData.examFee + formData.otherFee).toLocaleString()}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Structure</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
