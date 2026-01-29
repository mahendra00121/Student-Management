"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SchoolProfile = {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
};

export type AcademicYear = {
    activeYear: string;
    startDate: string;
    endDate: string;
};

export type GradeConfig = {
    id: string;
    grade: string;
    minPercent: number;
    maxPercent: number;
    remark: string;
};

export type Permission = {
    module: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
};

export type RolePermissions = {
    role: "admin" | "teacher" | "student";
    permissions: Permission[];
};

interface SettingsContextType {
    schoolProfile: SchoolProfile;
    academicYear: AcademicYear;
    grades: GradeConfig[];
    rolePermissions: RolePermissions[];
    updateSchoolProfile: (profile: SchoolProfile) => void;
    updateAcademicYear: (year: AcademicYear) => void;
    addGrade: (grade: GradeConfig) => void;
    updateGrade: (id: string, updated: Partial<GradeConfig>) => void;
    deleteGrade: (id: string) => void;
    updatePermission: (role: string, module: string, field: keyof Permission, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultProfile: SchoolProfile = {
    name: "High School Academy",
    address: "123 Educational Street, Knowledge City",
    phone: "+1 234 567 8900",
    email: "contact@highschool.edu",
};

const defaultYear: AcademicYear = {
    activeYear: "2023-2024",
    startDate: "2023-04-01",
    endDate: "2024-03-31",
};

const defaultGrades: GradeConfig[] = [
    { id: "1", grade: "A+", minPercent: 90, maxPercent: 100, remark: "Outstanding" },
    { id: "2", grade: "A", minPercent: 80, maxPercent: 89, remark: "Excellent" },
    { id: "3", grade: "B", minPercent: 70, maxPercent: 79, remark: "Very Good" },
    { id: "4", grade: "C", minPercent: 60, maxPercent: 69, remark: "Good" },
    { id: "5", grade: "Pass", minPercent: 40, maxPercent: 59, remark: "Average" },
    { id: "6", grade: "Fail", minPercent: 0, maxPercent: 39, remark: "Improvement Needed" },
];

const defaultPermissions: RolePermissions[] = [
    {
        role: "admin",
        permissions: [
            { module: "Students", view: true, add: true, edit: true, delete: true },
            { module: "Teachers", view: true, add: true, edit: true, delete: true },
            { module: "Exams", view: true, add: true, edit: true, delete: true },
        ]
    },
    {
        role: "teacher",
        permissions: [
            { module: "Students", view: true, add: false, edit: true, delete: false },
            { module: "Exams", view: true, add: false, edit: true, delete: false },
        ]
    }
];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(defaultProfile);
    const [academicYear, setAcademicYear] = useState<AcademicYear>(defaultYear);
    const [grades, setGrades] = useState<GradeConfig[]>(defaultGrades);
    const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(defaultPermissions);

    useEffect(() => {
        const savedProfile = localStorage.getItem("settings_profile");
        const savedYear = localStorage.getItem("settings_year");
        const savedGrades = localStorage.getItem("settings_grades");
        const savedPerms = localStorage.getItem("settings_permissions");

        if (savedProfile) setSchoolProfile(JSON.parse(savedProfile));
        if (savedYear) setAcademicYear(JSON.parse(savedYear));
        if (savedGrades) setGrades(JSON.parse(savedGrades));
        if (savedPerms) setRolePermissions(JSON.parse(savedPerms));
    }, []);

    useEffect(() => {
        localStorage.setItem("settings_profile", JSON.stringify(schoolProfile));
        localStorage.setItem("settings_year", JSON.stringify(academicYear));
        localStorage.setItem("settings_grades", JSON.stringify(grades));
        localStorage.setItem("settings_permissions", JSON.stringify(rolePermissions));
    }, [schoolProfile, academicYear, grades, rolePermissions]);

    const updateSchoolProfile = (profile: SchoolProfile) => setSchoolProfile(profile);
    const updateAcademicYear = (year: AcademicYear) => setAcademicYear(year);

    const addGrade = (grade: GradeConfig) => setGrades(prev => [...prev, grade]);
    const updateGrade = (id: string, updated: Partial<GradeConfig>) => {
        setGrades(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
    };
    const deleteGrade = (id: string) => setGrades(prev => prev.filter(g => g.id !== id));

    const updatePermission = (role: string, module: string, field: keyof Permission, value: boolean) => {
        setRolePermissions(prev => prev.map(rp => {
            if (rp.role === role) {
                return {
                    ...rp,
                    permissions: rp.permissions.map(p =>
                        p.module === module ? { ...p, [field]: value } : p
                    )
                };
            }
            return rp;
        }));
    };

    return (
        <SettingsContext.Provider value={{
            schoolProfile,
            academicYear,
            grades,
            rolePermissions,
            updateSchoolProfile,
            updateAcademicYear,
            addGrade,
            updateGrade,
            deleteGrade,
            updatePermission
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
