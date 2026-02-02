"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Grade = "A+" | "A" | "B" | "C" | "Fail";

export type SubjectMark = {
    subjectId: string;
    subjectName: string;
    marksObtained: number;
    maxMarks: number;
    grade: Grade;
};

export type ExamResult = {
    id: string;
    studentId: string;
    studentName: string;
    rollNumber: string;
    examId: string;
    examName: string;
    classId: string;
    section?: string;
    marks: SubjectMark[];
    totalMarks: number;
    maxTotalMarks: number;
    percentage: number;
    finalGrade: Grade;
    status: "Pass" | "Fail";
    isLocked: boolean;
};

interface ResultContextType {
    results: ExamResult[];
    loading: boolean;
    upsertResults: (
        examId: string,
        examName: string,
        subjectId: string,
        subjectName: string,
        maxMarks: number,
        entries: { studentId: string; studentName: string; rollNumber: string; classId: string; section?: string; marksObtained: number }[]
    ) => Promise<void>;
    getStudentResult: (studentId: string, examId: string) => ExamResult | undefined;
    getExamResults: (examId: string, classId?: string) => ExamResult[];
    refreshResults: () => Promise<void>;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/result";

export function ResultProvider({ children }: { children: React.ReactNode }) {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch results");
            const data = await response.json();

            const mappedData: ExamResult[] = data.map((r: any) => ({
                id: r.id,
                studentId: r.studentId,
                studentName: r.studentName,
                rollNumber: r.rollNumber,
                examId: r.examId,
                examName: r.examName,
                classId: r.classId,
                section: r.section,
                marks: r.marksJson ? JSON.parse(r.marksJson) : [],
                totalMarks: r.totalMarks,
                maxTotalMarks: r.maxTotalMarks,
                percentage: r.percentage,
                finalGrade: r.finalGrade as Grade,
                status: r.status as "Pass" | "Fail",
                isLocked: r.isLocked
            }));
            setResults(mappedData);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const calculateGrade = (marks: number, max: number): Grade => {
        const percentage = (marks / max) * 100;
        if (percentage >= 90) return "A+";
        if (percentage >= 75) return "A";
        if (percentage >= 60) return "B";
        if (percentage >= 40) return "C";
        return "Fail";
    };

    const upsertResults = async (
        examId: string,
        examName: string,
        subjectId: string,
        subjectName: string,
        maxMarks: number,
        entries: { studentId: string; studentName: string; rollNumber: string; classId: string; section?: string; marksObtained: number }[]
    ) => {
        const newResultsToUpdate: any[] = [];

        entries.forEach(entry => {
            const existing = results.find(r => r.studentId === entry.studentId && r.examId === examId);
            const grade = calculateGrade(entry.marksObtained, maxMarks);
            const subMark: SubjectMark = {
                subjectId,
                subjectName,
                marksObtained: entry.marksObtained,
                maxMarks,
                grade
            };

            let updatedMarks: SubjectMark[] = [];
            if (existing) {
                if (existing.isLocked) return;
                updatedMarks = [...existing.marks.filter(m => m.subjectId !== subjectId), subMark];
            } else {
                updatedMarks = [subMark];
            }

            const totalMarks = updatedMarks.reduce((s, m) => s + m.marksObtained, 0);
            const maxTotalMarks = updatedMarks.reduce((s, m) => s + m.maxMarks, 0);
            const percentage = (totalMarks / maxTotalMarks) * 100;
            const finalGrade = calculateGrade(totalMarks, maxTotalMarks);

            newResultsToUpdate.push({
                studentId: entry.studentId,
                studentName: entry.studentName,
                rollNumber: entry.rollNumber,
                examId,
                examName,
                classId: entry.classId,
                section: entry.section,
                marksJson: JSON.stringify(updatedMarks),
                totalMarks,
                maxTotalMarks,
                percentage,
                finalGrade,
                status: finalGrade === "Fail" ? "Fail" : "Pass",
                isLocked: false
            });
        });

        try {
            const response = await fetch(`${API_URL}/upsert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newResultsToUpdate)
            });

            if (!response.ok) throw new Error("Failed to upsert results");
            await fetchResults();
        } catch (error) {
            console.error("Error upserting results:", error);
            throw error;
        }
    };

    const getStudentResult = (studentId: string, examId: string) => {
        return results.find((r) => r.studentId === studentId && r.examId === examId);
    };

    const getExamResults = (examId: string, classId?: string) => {
        return results.filter(r => r.examId === examId && (classId ? r.classId === classId : true));
    };

    return (
        <ResultContext.Provider value={{
            results,
            loading,
            upsertResults,
            getStudentResult,
            getExamResults,
            refreshResults: fetchResults
        }}>
            {children}
        </ResultContext.Provider>
    );
}

export function useResults() {
    const context = useContext(ResultContext);
    if (context === undefined) {
        throw new Error("useResults must be used within a ResultProvider");
    }
    return context;
}
