"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Teacher = {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    phone: string;
    subjects: string[];
    classes: string[];
    status: "Active" | "Inactive";
};

interface TeacherContextType {
    teachers: Teacher[];
    loading: boolean;
    addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
    updateTeacher: (id: string, updatedTeacher: Partial<Teacher>) => Promise<void>;
    deleteTeacher: (id: string) => Promise<void>;
    getTeacher: (id: string) => Teacher | undefined;
    refreshTeachers: () => Promise<void>;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/teacher";

export function TeacherProvider({ children }: { children: React.ReactNode }) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch teachers");
            const data = await response.json();

            const mappedData: Teacher[] = data.map((t: any) => ({
                id: t.id,
                name: t.name,
                employeeId: t.employeeId,
                email: t.email,
                phone: t.phone,
                subjects: t.subjects ? t.subjects.split(",") : [],
                classes: t.classes ? t.classes.split(",") : [],
                status: t.status as "Active" | "Inactive"
            }));
            setTeachers(mappedData);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
        try {
            const payload = {
                name: teacher.name,
                employeeId: teacher.employeeId,
                email: teacher.email || null,
                phone: teacher.phone || null,
                subjects: teacher.subjects.join(","),
                classes: teacher.classes.join(","),
                status: teacher.status
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            await fetchTeachers();
        } catch (error) {
            console.error("Error adding teacher:", error);
            throw error;
        }
    };

    const updateTeacher = async (id: string, updatedTeacher: Partial<Teacher>) => {
        try {
            const existing = teachers.find(t => t.id === id);
            if (!existing) return;

            const payload = {
                id: id,
                name: updatedTeacher.name || existing.name,
                employeeId: updatedTeacher.employeeId || existing.employeeId,
                email: updatedTeacher.email || existing.email || null,
                phone: updatedTeacher.phone || existing.phone || null,
                subjects: (updatedTeacher.subjects || existing.subjects).join(","),
                classes: (updatedTeacher.classes || existing.classes).join(","),
                status: updatedTeacher.status || existing.status
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update teacher");
            await fetchTeachers();
        } catch (error) {
            console.error("Error updating teacher:", error);
            throw error;
        }
    };

    const deleteTeacher = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete teacher");
            setTeachers(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting teacher:", error);
            throw error;
        }
    };

    const getTeacher = (id: string) => {
        return teachers.find((t) => t.id === id);
    };

    return (
        <TeacherContext.Provider
            value={{
                teachers,
                loading,
                addTeacher,
                updateTeacher,
                deleteTeacher,
                getTeacher,
                refreshTeachers: fetchTeachers
            }}
        >
            {children}
        </TeacherContext.Provider>
    );
}

export function useTeachers() {
    const context = useContext(TeacherContext);
    if (context === undefined) {
        throw new Error("useTeachers must be used within a TeacherProvider");
    }
    return context;
}
