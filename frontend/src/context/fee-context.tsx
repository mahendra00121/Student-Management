"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type FeeStructure = {
    id: string;
    className: string;
    tuitionFee: number;
    examFee: number;
    otherFee: number;
    totalFee: number;
};

export type PaymentMode = "Cash" | "UPI" | "Bank";

export type Payment = {
    id: string;
    studentId: string;
    date: string;
    amountPaid: number;
    mode: PaymentMode;
    remark?: string;
};

export type StudentFeeRecord = {
    id?: string;
    studentId: string;
    studentName: string;
    rollNumber: string;
    className: string;
    totalFee: number;
    paidAmount: number;
    pendingAmount: number;
    status: "Paid" | "Partial" | "Pending";
    payments: Payment[];
};

interface FeeContextType {
    feeStructures: FeeStructure[];
    studentFeeRecords: StudentFeeRecord[];
    loading: boolean;
    addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => Promise<void>;
    updateFeeStructure: (id: string, updated: Partial<FeeStructure>) => Promise<void>;
    deleteFeeStructure: (id: string) => Promise<void>;
    addPayment: (studentId: string, payment: Omit<Payment, 'id' | 'studentId'>, initialRecord?: any) => Promise<void>;
    getStudentFeeRecord: (studentId: string) => Promise<StudentFeeRecord | undefined>;
    refreshFeeData: () => Promise<void>;
}

const FeeContext = createContext<FeeContextType | undefined>(undefined);

const API_BASE = "http://localhost:5174/api";

export function FeeProvider({ children }: { children: React.ReactNode }) {
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [studentFeeRecords, setStudentFeeRecords] = useState<StudentFeeRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeeData = async () => {
        setLoading(true);
        try {
            // Fetch fee structures
            const structRes = await fetch(`${API_BASE}/feestructure`);
            if (structRes.ok) {
                const structs = await structRes.json();
                setFeeStructures(structs.map((s: any) => ({
                    id: s.id,
                    className: s.className,
                    tuitionFee: s.tuitionFee,
                    examFee: s.examFee,
                    otherFee: s.otherFee,
                    totalFee: s.totalFee
                })));
            }

            // Fetch student fee records
            const feeRes = await fetch(`${API_BASE}/fee`);
            if (feeRes.ok) {
                const data = await feeRes.json();
                const mappedData: StudentFeeRecord[] = data.map((r: any) => ({
                    id: r.id,
                    studentId: r.studentId,
                    studentName: r.studentName,
                    rollNumber: r.rollNumber,
                    className: r.classId,
                    totalFee: r.totalAmount,
                    paidAmount: r.paidAmount,
                    pendingAmount: r.totalAmount - r.paidAmount,
                    status: r.status as "Paid" | "Partial" | "Pending",
                    payments: r.paymentHistoryJson ? JSON.parse(r.paymentHistoryJson) : []
                }));
                setStudentFeeRecords(mappedData);
            }
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeData();
    }, []);

    const addFeeStructure = async (structure: Omit<FeeStructure, 'id'>) => {
        try {
            const response = await fetch(`${API_BASE}/feestructure`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(structure)
            });
            if (!response.ok) throw new Error("Failed to save fee structure");
            await fetchFeeData();
        } catch (error) {
            console.error("Error saving fee structure:", error);
            throw error;
        }
    };

    const updateFeeStructure = async (id: string, updated: Partial<FeeStructure>) => {
        // Post handles update in this controller logic
        await addFeeStructure(updated as Omit<FeeStructure, 'id'>);
    };

    const deleteFeeStructure = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE}/feestructure/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Failed to delete fee structure");
            await fetchFeeData();
        } catch (error) {
            console.error("Error deleting fee structure:", error);
            throw error;
        }
    };

    const addPayment = async (studentId: string, payment: Omit<Payment, 'id' | 'studentId'>, initialRecord?: any) => {
        try {
            let record = studentFeeRecords.find(r => r.studentId === studentId) || initialRecord;

            if (!record) {
                console.error("Fee record not found for student:", studentId);
                return;
            }

            const newPayment = { ...payment, id: Math.random().toString(36).substr(2, 9), studentId };
            const newPaidAmount = (record.paidAmount || 0) + payment.amountPaid;
            const newPayments = [...(record.payments || []), newPayment];

            let newStatus: "Paid" | "Partial" | "Pending" = "Pending";
            if (newPaidAmount >= record.totalFee) newStatus = "Paid";
            else if (newPaidAmount > 0) newStatus = "Partial";

            const payload = {
                studentId: studentId,
                studentName: record.studentName,
                rollNumber: record.rollNumber,
                classId: record.className,
                totalAmount: record.totalFee,
                paidAmount: newPaidAmount,
                status: newStatus,
                paymentHistoryJson: JSON.stringify(newPayments)
            };

            const response = await fetch(`${API_BASE}/fee/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to record payment");
            await fetchFeeData();
        } catch (error) {
            console.error("Error recording payment:", error);
            throw error;
        }
    };

    const getStudentFeeRecord = async (studentId: string) => {
        return studentFeeRecords.find(r => r.studentId === studentId);
    };

    return (
        <FeeContext.Provider value={{
            feeStructures,
            studentFeeRecords,
            loading,
            addFeeStructure,
            updateFeeStructure,
            deleteFeeStructure,
            addPayment,
            getStudentFeeRecord,
            refreshFeeData: fetchFeeData
        }}>
            {children}
        </FeeContext.Provider>
    );
}

export function useFees() {
    const context = useContext(FeeContext);
    if (context === undefined) {
        throw new Error("useFees must be used within a FeeProvider");
    }
    return context;
}
