"use client"

import React from 'react'
import ExamplePieChart from './fokusTime';

const StudentProfilePage = () => {

    return (
        <section className="w-full">
            <section className='flex flex-col md:flex-row items-center md:items-stretch py-6 px-6 mt-10 border rounded-xl gap-6 md:gap-8 bg-white shadow-sm'>
                <section className='flex flex-col items-center justify-center w-full md:w-5/12 lg:w-4/12'>
                    <h3 className="font-semibold text-lg mb-4 text-slate-700">Focus Time Distribution</h3>
                    <div className="w-full max-w-[250px] aspect-square">
                        <ExamplePieChart />
                    </div>
                </section>
                <section className='flex flex-col justify-center flex-1 w-full'>
                    <h3 className="font-semibold text-slate-600 mb-2">Kesimpulan AI</h3>
                    <section className='bg-slate-100 border border-slate-200 p-6 rounded-xl flex items-start gap-3'>
                        <span className="text-2xl">💡</span>
                        <div className="space-y-1">
                            <h1 className="font-medium text-slate-800 leading-relaxed">
                                Berdasarkan pola Anda, waktu belajar paling efektif Anda adalah <span className="font-bold text-blue-600">Pagi hari (7:00 - 11:00)</span>.
                            </h1>
                            <p className="text-xs text-slate-500 mt-2">
                                *Cobalah alokasikan materi sulit di jam ini.
                            </p>
                        </div>
                    </section>
                </section>

            </section>
        </section>
    )
}

export default StudentProfilePage