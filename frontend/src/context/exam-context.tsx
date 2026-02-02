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
    classId: string;
    startDate: string;
    endDate: string;
    status: ExamStatus;
    subjects: ExamSubject[];
};

interface ExamContextType {
    exams: Exam[];
    loading: boolean;
    addExam: (exam: Omit<Exam, 'id'>) => Promise<void>;
    updateExam: (id: string, updatedExam: Partial<Exam>) => Promise<void>;
    deleteExam: (id: string) => Promise<void>;
    getExam: (id: string) => Exam | undefined;
    refreshExams: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/exam";

export function ExamProvider({ children }: { children: React.ReactNode }) {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch exams");
            const data = await response.json();

            const mappedData: Exam[] = data.map((e: any) => ({
                id: e.id,
                name: e.name,
                type: e.type as ExamType,
                classId: e.classId,
                startDate: e.startDate,
                endDate: e.endDate,
                status: e.status as ExamStatus,
                subjects: e.subjectsJson ? JSON.parse(e.subjectsJson) : []
            }));
            setExams(mappedData);
        } catch (error) {
            console.error("Error fetching exams:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const addExam = async (exam: Omit<Exam, 'id'>) => {
        try {
            const payload = {
                name: exam.name,
                type: exam.type,
                classId: exam.classId,
                startDate: exam.startDate,
                endDate: exam.endDate,
                status: exam.status,
                subjectsJson: JSON.stringify(exam.subjects)
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to add exam");
            await fetchExams();
        } catch (error) {
            console.error("Error adding exam:", error);
            throw error;
        }
    };

    const updateExam = async (id: string, updatedExam: Partial<Exam>) => {
        try {
            const existing = exams.find(e => e.id === id);
            if (!existing) return;

            const payload = {
                id: id,
                name: updatedExam.name || existing.name,
                type: updatedExam.type || existing.type,
                classId: updatedExam.classId || existing.classId,
                startDate: updatedExam.startDate || existing.startDate,
                endDate: updatedExam.endDate || existing.endDate,
                status: updatedExam.status || existing.status,
                subjectsJson: JSON.stringify(updatedExam.subjects || existing.subjects)
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update exam");
            await fetchExams();
        } catch (error) {
            console.error("Error updating exam:", error);
            throw error;
        }
    };

    const deleteExam = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete exam");
            setExams(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting exam:", error);
            throw error;
        }
    };

    const getExam = (id: string) => {
        return exams.find((e) => e.id === id);
    };

    return (
        <ExamContext.Provider value={{
            exams,
            loading,
            addExam,
            updateExam,
            deleteExam,
            getExam,
            refreshExams: fetchExams
        }}>
            {children}
        </ExamContext.Provider>
    );
}

export function useExams() {
    const context = useContext(ExamContext);
    if (context === undefined) {
        throw new Error("useExams must be used within a ExamProvider");
    }
    return context;
}
