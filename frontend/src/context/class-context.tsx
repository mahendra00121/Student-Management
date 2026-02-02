"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ClassItem = {
    id: string;
    name: string;
    sections: string[];
    classTeacherId?: string;
    classTeacherName?: string;
};

interface ClassContextType {
    classes: ClassItem[];
    loading: boolean;
    addClass: (classItem: Omit<ClassItem, 'id'>) => Promise<void>;
    updateClass: (id: string, updatedClass: Partial<ClassItem>) => Promise<void>;
    deleteClass: (id: string) => Promise<void>;
    getClass: (id: string) => ClassItem | undefined;
    refreshClasses: () => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/class";

export function ClassProvider({ children }: { children: React.ReactNode }) {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch classes");
            const data = await response.json();

            const mappedData: ClassItem[] = data.map((c: any) => ({
                id: c.id,
                name: c.name,
                sections: c.sections ? c.sections.split(",") : [],
                classTeacherId: c.classTeacherId,
                classTeacherName: c.classTeacherName
            }));
            setClasses(mappedData);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const addClass = async (classItem: Omit<ClassItem, 'id'>) => {
        try {
            const payload = {
                name: classItem.name,
                sections: classItem.sections.join(","),
                classTeacherId: classItem.classTeacherId || null,
                classTeacherName: classItem.classTeacherName || null
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to add class");
            await fetchClasses();
        } catch (error) {
            console.error("Error adding class:", error);
            throw error;
        }
    };

    const updateClass = async (id: string, updatedClass: Partial<ClassItem>) => {
        try {
            const existing = classes.find(c => c.id === id);
            if (!existing) return;

            const payload = {
                id: id,
                name: updatedClass.name || existing.name,
                sections: (updatedClass.sections || existing.sections).join(","),
                classTeacherId: updatedClass.classTeacherId || existing.classTeacherId || null,
                classTeacherName: updatedClass.classTeacherName || existing.classTeacherName || null
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update class");
            await fetchClasses();
        } catch (error) {
            console.error("Error updating class:", error);
            throw error;
        }
    };

    const deleteClass = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete class");
            setClasses(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting class:", error);
            throw error;
        }
    };

    const getClass = (id: string) => {
        return classes.find((c) => c.id === id);
    };

    return (
        <ClassContext.Provider
            value={{
                classes,
                loading,
                addClass,
                updateClass,
                deleteClass,
                getClass,
                refreshClasses: fetchClasses
            }}
        >
            {children}
        </ClassContext.Provider>
    );
}

export function useClasses() {
    const context = useContext(ClassContext);
    if (context === undefined) {
        throw new Error("useClasses must be used within a ClassProvider");
    }
    return context;
}
