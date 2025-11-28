"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
    { day: "Sen", duration: 30 },
    { day: "Sel", duration: 45 },
    { day: "Rab", duration: 20 },
    { day: "Kam", duration: 10 },
    { day: "Jum", duration: 50 },
    { day: "Sab", duration: 5 },
    { day: "Min", duration: 0 },
];

const WeeklyActivity = () => {
    return (
        <section className="w-full">
            <section className='flex flex-col md:flex-row items-center py-6 px-6 mt-10 border rounded-xl gap-8 bg-white shadow-sm'>

                {/* BAGIAN 1: GRAFIK (Responsive) */}
                {/* Kita beri lebar penuh di mobile, dan 60% (w-7/12) di desktop */}
                <section className='flex flex-col gap-4 w-full md:w-7/12'>
                    <h3 className="font-semibold text-lg text-slate-700">Weekly Activity</h3>

                    {/* 2. Bungkus Chart dengan div yang punya tinggi pasti (h-[300px]) */}
                    <div className="w-full h-[300px]">
                        {/* 3. Gunakan ResponsiveContainer */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                {/* Hapus properti width/height statis dari BarChart */}
                                <Bar
                                    dataKey="duration"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* BAGIAN 2: KESIMPULAN */}
                {/* Flex-1 agar mengisi sisa ruang di kanan */}
                <section className='flex flex-col justify-center flex-1 w-full'>
                    <h3 className="font-semibold text-slate-600 mb-2">Analisis Aktivitas</h3>

                    <section className='bg-slate-100 border border-slate-200 p-6 rounded-xl flex flex-col gap-2'>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">📅</span>
                            <h1 className="font-medium text-slate-800">
                                Anda paling aktif belajar di hari <span className="font-bold text-blue-600">Jum&apos;at</span>.
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500 pl-10">
                            Pertahankan momentum ini untuk akhir pekan!
                        </p>
                    </section>
                </section>

            </section>
        </section>

    );
};

export default WeeklyActivity;
