"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts"
import { useStudents } from "@/context/student-context";
import { useClasses } from "@/context/class-context";

export function OverviewChart() {
    const { students } = useStudents();
    const { classes } = useClasses();

    const colors = [
        "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
        "#f43f5e", "#f97316", "#eab308", "#84cc16", "#10b981",
        "#06b6d4", "#3b82f6"
    ];

    const data = classes.map((c, index) => ({
        name: `CL-${c.name}`,
        total: students.filter(s => s.class === c.name).length,
        color: colors[index % colors.length]
    })).sort((a, b) => {
        // Sort numeric classes properly
        const numA = parseInt(a.name.split('-')[1]);
        const numB = parseInt(b.name.split('-')[1]);
        return numA - numB;
    });

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground font-bold">
                No class data available to visualize.
            </div>
        );
    }

    return (
        <div className="w-full h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight="black"
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight="black"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                        labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <Bar
                        dataKey="total"
                        radius={[10, 10, 10, 10]}
                        barSize={24}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} className="hover:fill-opacity-100 transition-all duration-300" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
