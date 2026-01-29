"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts"

const data = [
    { name: "CL-1", total: 45, color: "#6366f1" },
    { name: "CL-2", total: 42, color: "#8b5cf6" },
    { name: "CL-3", total: 48, color: "#a855f7" },
    { name: "CL-4", total: 40, color: "#d946ef" },
    { name: "CL-5", total: 52, color: "#ec4899" },
    { name: "CL-6", total: 49, color: "#f43f5e" },
    { name: "CL-7", total: 45, color: "#f97316" },
    { name: "CL-8", total: 50, color: "#eab308" },
    { name: "CL-9", total: 48, color: "#84cc16" },
    { name: "CL-10", total: 55, color: "#10b981" },
]

export function OverviewChart() {
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
