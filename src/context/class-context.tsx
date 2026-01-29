"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ClassItem = {
    id: string;
    name: string; // e.g. "10", "12"
    sections: string[]; // e.g. ["A", "B", "C"]
    classTeacherId?: string; // ID from TeacherContext
    classTeacherName?: string; // Denormalized for display ease, or fetch from context
};

interface ClassContextType {
    classes: ClassItem[];
    addClass: (classItem: ClassItem) => void;
    updateClass: (id: string, updatedClass: Partial<ClassItem>) => void;
    deleteClass: (id: string) => void;
    getClass: (id: string) => ClassItem | undefined;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Initial dummy data
const initialClasses: ClassItem[] = [
    { id: "1", name: "10", sections: ["A", "B"], classTeacherId: "1", classTeacherName: "Sarah Williams" },
    { id: "2", name: "9", sections: ["A", "B", "C"], classTeacherId: "2", classTeacherName: "David Johnson" },
    { id: "3", name: "8", sections: ["A"], classTeacherId: "4", classTeacherName: "Michael Davis" },
];

export function ClassProvider({ children }: { children: React.ReactNode }) {
    const [classes, setClasses] = useState<ClassItem[]>([]);

    // Load from local storage or set initial
    useEffect(() => {
        const saved = localStorage.getItem("classes");
        if (saved) {
            try {
                setClasses(JSON.parse(saved));
            } catch (e) {
                setClasses(initialClasses);
            }
        } else {
            setClasses(initialClasses);
        }
    }, []);

    // Save to local storage whenever classes change
    useEffect(() => {
        if (classes.length > 0) {
            localStorage.setItem("classes", JSON.stringify(classes));
        }
    }, [classes]);

    const addClass = (classItem: ClassItem) => {
        setClasses((prev) => [classItem, ...prev]);
    };

    const updateClass = (id: string, updatedClass: Partial<ClassItem>) => {
        setClasses((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, ...updatedClass } : c
            )
        );
    };

    const deleteClass = (id: string) => {
        setClasses((prev) => prev.filter((c) => c.id !== id));
    };

    const getClass = (id: string) => {
        return classes.find((c) => c.id === id);
    };

    return (
        <ClassContext.Provider
            value={{ classes, addClass, updateClass, deleteClass, getClass }}
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
