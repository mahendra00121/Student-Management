"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
    { name: "Jan", attendance: 92 },
    { name: "Feb", attendance: 95 },
    { name: "Mar", attendance: 90 },
    { name: "Apr", attendance: 94 },
    { name: "May", attendance: 88 },
    { name: "Jun", attendance: 96 },
    { name: "Jul", attendance: 92 },
]

export function AttendanceChart() {
    return (
        <div className="w-full h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ fontWeight: 'black', fontSize: '12px', color: '#10b981' }}
                        labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="#10b981"
                        strokeWidth={5}
                        fillOpacity={1}
                        fill="url(#colorAttendance)"
                        dot={{ r: 6, fill: "#fff", stroke: "#10b981", strokeWidth: 3 }}
                        activeDot={{ r: 8, strokeWidth: 4, fill: "#fff", stroke: "#10b981" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
