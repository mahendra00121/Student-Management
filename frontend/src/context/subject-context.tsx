"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Subject = {
    id: string;
    name: string;
    class: string;
    section?: string;
    teacherId?: string;
    teacherName?: string;
    status: "Active" | "Inactive";
};

interface SubjectContextType {
    subjects: Subject[];
    loading: boolean;
    addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
    updateSubject: (id: string, updatedSubject: Partial<Subject>) => Promise<void>;
    deleteSubject: (id: string) => Promise<void>;
    getSubject: (id: string) => Subject | undefined;
    refreshSubjects: () => Promise<void>;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/subject";

export function SubjectProvider({ children }: { children: React.ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch subjects");
            const data = await response.json();

            const mappedData: Subject[] = data.map((s: any) => ({
                id: s.id,
                name: s.name,
                class: s.className,
                teacherId: s.teacherId,
                teacherName: s.teacherName,
                status: s.status as "Active" | "Inactive"
            }));
            setSubjects(mappedData);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const addSubject = async (subject: Omit<Subject, 'id'>) => {
        try {
            const payload = {
                name: subject.name,
                className: subject.class,
                teacherId: subject.teacherId || null,
                teacherName: subject.teacherName || null,
                status: subject.status
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to add subject");
            await fetchSubjects();
        } catch (error) {
            console.error("Error adding subject:", error);
            throw error;
        }
    };

    const updateSubject = async (id: string, updatedSubject: Partial<Subject>) => {
        try {
            const existing = subjects.find(s => s.id === id);
            if (!existing) return;

            const payload = {
                id: id,
                name: updatedSubject.name || existing.name,
                className: updatedSubject.class || existing.class,
                teacherId: updatedSubject.teacherId || existing.teacherId || null,
                teacherName: updatedSubject.teacherName || existing.teacherName || null,
                status: updatedSubject.status || existing.status
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update subject");
            await fetchSubjects();
        } catch (error) {
            console.error("Error updating subject:", error);
            throw error;
        }
    };

    const deleteSubject = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete subject");
            setSubjects(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting subject:", error);
            throw error;
        }
    };

    const getSubject = (id: string) => {
        return subjects.find((s) => s.id === id);
    };

    return (
        <SubjectContext.Provider
            value={{
                subjects,
                loading,
                addSubject,
                updateSubject,
                deleteSubject,
                getSubject,
                refreshSubjects: fetchSubjects
            }}
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
