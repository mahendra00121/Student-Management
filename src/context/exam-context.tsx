"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ExamType = "Unit" | "Mid" | "Final";
export type ExamStatus = "Upcoming" | "Ongoing" | "Completed";

export type ExamSubject = {
    subjectId: string;
    subjectName: string;
    date: string;
    startTime: string;
    endTime: string;
    maxMarks: number;
    passingMarks: number;
};

export type Exam = {
    id: string;
    name: string;
    type: ExamType;
    classId: string; // The class name/ID
    startDate: string;
    endDate: string;
    status: ExamStatus;
    subjects: ExamSubject[];
};

interface ExamContextType {
    exams: Exam[];
    addExam: (exam: Exam) => void;
    updateExam: (id: string, updatedExam: Partial<Exam>) => void;
    deleteExam: (id: string) => void;
    getExam: (id: string) => Exam | undefined;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const initialExams: Exam[] = [
    {
        id: "1",
        name: "First Unit Test",
        type: "Unit",
        classId: "10",
        startDate: "2024-02-15",
        endDate: "2024-02-20",
        status: "Upcoming",
        subjects: [
            {
                subjectId: "1",
                subjectName: "Mathematics",
                date: "2024-02-15",
                startTime: "09:00",
                endTime: "11:00",
                maxMarks: 50,
                passingMarks: 17
            }
        ]
    }
];

export function ExamProvider({ children }: { children: React.ReactNode }) {
    const [exams, setExams] = useState<Exam[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("exams");
        if (saved) {
            try {
                setExams(JSON.parse(saved));
            } catch (e) {
                setExams(initialExams);
            }
        } else {
            setExams(initialExams);
        }
    }, []);

    useEffect(() => {
        if (exams.length > 0) {
            localStorage.setItem("exams", JSON.stringify(exams));
        }
    }, [exams]);

    const addExam = (exam: Exam) => {
        setExams((prev) => [exam, ...prev]);
    };

    const updateExam = (id: string, updatedExam: Partial<Exam>) => {
        setExams((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...updatedExam } : e))
        );
    };

    const deleteExam = (id: string) => {
        setExams((prev) => prev.filter((e) => e.id !== id));
    };

    const getExam = (id: string) => {
        return exams.find((e) => e.id === id);
    };

    return (
        <ExamContext.Provider value={{ exams, addExam, updateExam, deleteExam, getExam }}>
            {children}
        </ExamContext.Provider>
    );
}

export function useExams() {
    const context = useContext(ExamContext);
    if (context === undefined) {
        throw new Error("useExams must be used within an ExamProvider");
    }
    return context;
}
