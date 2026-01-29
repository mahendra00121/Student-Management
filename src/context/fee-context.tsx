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
    studentId: string;
    studentName: string;
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
    addFeeStructure: (structure: FeeStructure) => void;
    updateFeeStructure: (id: string, updated: Partial<FeeStructure>) => void;
    deleteFeeStructure: (id: string) => void;
    addPayment: (studentId: string, payment: Omit<Payment, 'id' | 'studentId'>) => void;
    getStudentFeeRecord: (studentId: string) => StudentFeeRecord | undefined;
    initializeStudentFee: (studentId: string, studentName: string, className: string) => void;
}

const FeeContext = createContext<FeeContextType | undefined>(undefined);

const initialStructures: FeeStructure[] = [
    { id: "1", className: "10", tuitionFee: 20000, examFee: 2000, otherFee: 1000, totalFee: 23000 },
    { id: "2", className: "12", tuitionFee: 25000, examFee: 2500, otherFee: 1500, totalFee: 29000 },
];

export function FeeProvider({ children }: { children: React.ReactNode }) {
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [studentFeeRecords, setStudentFeeRecords] = useState<StudentFeeRecord[]>([]);

    useEffect(() => {
        const savedStructures = localStorage.getItem("fee_structures");
        const savedRecords = localStorage.getItem("student_fees");

        if (savedStructures) setFeeStructures(JSON.parse(savedStructures));
        else setFeeStructures(initialStructures);

        if (savedRecords) setStudentFeeRecords(JSON.parse(savedRecords));
    }, []);

    useEffect(() => {
        localStorage.setItem("fee_structures", JSON.stringify(feeStructures));
    }, [feeStructures]);

    useEffect(() => {
        localStorage.setItem("student_fees", JSON.stringify(studentFeeRecords));
    }, [studentFeeRecords]);

    const addFeeStructure = (structure: FeeStructure) => {
        setFeeStructures(prev => [...prev, structure]);
    };

    const updateFeeStructure = (id: string, updated: Partial<FeeStructure>) => {
        setFeeStructures(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    };

    const deleteFeeStructure = (id: string) => {
        setFeeStructures(prev => prev.filter(s => s.id !== id));
    };

    const initializeStudentFee = (studentId: string, studentName: string, className: string) => {
        setStudentFeeRecords(prev => {
            const exists = prev.find(r => r.studentId === studentId);
            if (exists) return prev;

            const structure = feeStructures.find(s => s.className === className);
            const totalFee = structure ? structure.totalFee : 0;

            return [...prev, {
                studentId,
                studentName,
                className,
                totalFee,
                paidAmount: 0,
                pendingAmount: totalFee,
                status: "Pending",
                payments: []
            }];
        });
    };

    const addPayment = (studentId: string, payment: Omit<Payment, 'id' | 'studentId'>) => {
        setStudentFeeRecords(prev => prev.map(record => {
            if (record.studentId === studentId) {
                const newPaidAmount = record.paidAmount + payment.amountPaid;
                const newPendingAmount = Math.max(0, record.totalFee - newPaidAmount);

                let status: "Paid" | "Partial" | "Pending" = "Partial";
                if (newPaidAmount >= record.totalFee) status = "Paid";
                else if (newPaidAmount === 0) status = "Pending";

                return {
                    ...record,
                    paidAmount: newPaidAmount,
                    pendingAmount: newPendingAmount,
                    status,
                    payments: [...record.payments, { ...payment, id: Math.random().toString(36).substr(2, 9), studentId }]
                };
            }
            return record;
        }));
    };

    const getStudentFeeRecord = (studentId: string) => {
        return studentFeeRecords.find(r => r.studentId === studentId);
    };

    return (
        <FeeContext.Provider value={{
            feeStructures,
            studentFeeRecords,
            addFeeStructure,
            updateFeeStructure,
            deleteFeeStructure,
            addPayment,
            getStudentFeeRecord,
            initializeStudentFee
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
