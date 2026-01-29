"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Subject = {
    id: string;
    name: string;
    class: string; // e.g. "10", "12"
    section?: string; // e.g. "A" - Optional
    teacherId?: string;
    teacherName?: string; // Denormalized for display
    status: "Active" | "Inactive";
};

interface SubjectContextType {
    subjects: Subject[];
    addSubject: (subject: Subject) => void;
    updateSubject: (id: string, updatedSubject: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;
    getSubject: (id: string) => Subject | undefined;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

// Initial dummy data
const initialSubjects: Subject[] = [
    { id: "1", name: "Mathematics", class: "10", section: "A", teacherId: "1", teacherName: "Sarah Williams", status: "Active" },
    { id: "2", name: "Science", class: "10", section: "B", teacherId: "2", teacherName: "David Johnson", status: "Active" },
    { id: "3", name: "English", class: "9", teacherId: "3", teacherName: "Emily Brown", status: "Active" },
];

export function SubjectProvider({ children }: { children: React.ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // Load from local storage or set initial
    useEffect(() => {
        const saved = localStorage.getItem("subjects");
        if (saved) {
            try {
                setSubjects(JSON.parse(saved));
            } catch (e) {
                setSubjects(initialSubjects);
            }
        } else {
            setSubjects(initialSubjects);
        }
    }, []);

    // Save to local storage whenever subjects change
    useEffect(() => {
        if (subjects.length > 0) {
            localStorage.setItem("subjects", JSON.stringify(subjects));
        }
    }, [subjects]);

    const addSubject = (subject: Subject) => {
        setSubjects((prev) => [subject, ...prev]);
    };

    const updateSubject = (id: string, updatedSubject: Partial<Subject>) => {
        setSubjects((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, ...updatedSubject } : s
            )
        );
    };

    const deleteSubject = (id: string) => {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
    };

    const getSubject = (id: string) => {
        return subjects.find((s) => s.id === id);
    };

    return (
        <SubjectContext.Provider
            value={{ subjects, addSubject, updateSubject, deleteSubject, getSubject }}
        >
            {children}
        </SubjectContext.Provider>
    );
}

export function useSubjects() {
    const context = useContext(SubjectContext);
    if (context === undefined) {
        throw new Error("useSubjects must be used within a SubjectProvider");
    }
    return context;
}
