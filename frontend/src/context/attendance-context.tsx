"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AttendanceStatus = "Present" | "Absent" | "Late";

export type AttendanceRecord = {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    section?: string;
    date: string;
    status: AttendanceStatus;
    markedBy: string;
};

interface AttendanceContextType {
    attendanceRecords: AttendanceRecord[];
    loading: boolean;
    markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => Promise<void>;
    getAttendanceByDateAndClass: (date: string, classId: string, section?: string) => Promise<AttendanceRecord[]>;
    getStudentAttendance: (studentId: string) => Promise<AttendanceRecord[]>;
    refreshAttendance: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/attendance";

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllAttendance = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch attendance");
            const data = await response.json();
            setAttendanceRecords(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAttendance();
    }, []);

    const markAttendance = async (newRecords: Omit<AttendanceRecord, 'id'>[]) => {
        try {
            const response = await fetch(`${API_URL}/mark`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRecords)
            });

            if (!response.ok) throw new Error("Failed to mark attendance");
            await fetchAllAttendance();
        } catch (error) {
            console.error("Error marking attendance:", error);
            throw error;
        }
    };

    const getAttendanceByDateAndClass = async (date: string, classId: string, section?: string) => {
        try {
            const url = new URL(API_URL);
            url.searchParams.append("date", date);
            url.searchParams.append("classId", classId);
            if (section) url.searchParams.append("section", section);

            const response = await fetch(url.toString());
            if (!response.ok) throw new Error("Failed to fetch filtered attendance");
            return await response.json();
        } catch (error) {
            console.error("Error getting attendance by date/class:", error);
            return [];
        }
    };

    const getStudentAttendance = async (studentId: string) => {
        return attendanceRecords.filter(r => r.studentId === studentId);
    };

    return (
        <AttendanceContext.Provider value={{
            attendanceRecords,
            loading,
            markAttendance,
            getAttendanceByDateAndClass,
            getStudentAttendance,
            refreshAttendance: fetchAllAttendance
        }}>
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    const context = useContext(AttendanceContext);
    if (context === undefined) {
        throw new Error("useAttendance must be used within an AttendanceProvider");
    }
    return context;
}
