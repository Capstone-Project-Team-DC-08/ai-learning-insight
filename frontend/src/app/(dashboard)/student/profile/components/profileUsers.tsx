"use client"

import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaLocationDot, FaPencil } from "react-icons/fa6";
import { Badge } from '@/components/ui/badge';

type User = {
    name: string;
    city?: string;
};

const ProfileUsersPage = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Ambil User dari LocalStorage
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        }

    }, []);

    return (
        <section className="w-full">
            <section className="
                group relative
                flex flex-col md:flex-row 
                items-center md:items-start
                gap-6 
                bg-white 
                border border-slate-100 
                shadow-sm hover:shadow-md
                rounded-2xl 
                p-8 md:p-10
                transition-all duration-300 ease-in-out
            ">
                <div className="relative shrink-0">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 shadow-xl shadow-slate-200/50 ring-4 ring-white">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback className="bg-slate-100 text-slate-500">CN</AvatarFallback>
                    </Avatar>
                    <button className='
                        absolute -right-2 bottom-0 
                        bg-white text-slate-600 
                       shadow-md border border-slate-100
                        rounded-full p-2.5 
                        flex items-center justify-center
                    '>
                        <FaPencil className="text-[12px]" />
                    </button>
                </div>
                <div className="flex flex-col gap-3 items-center md:items-start w-full mt-2">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <h2 className="font-bold text-2xl md:text-3xl text-slate-800 tracking-tight">
                            {user?.name || "Student"}
                        </h2>
                        <Badge
                            variant="secondary"
                            className="
                                bg-blue-50 text-blue-600 
                                hover:bg-blue-100 
                                border border-blue-100
                                px-3 py-1 rounded-full 
                                font-medium text-xs tracking-wide uppercase
                            "
                        >
                            High Consistency
                        </Badge>
                    </div>

                    {/* Lokasi (Subtle Text) */}
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                        <FaLocationDot className="text-slate-400" />
                         {user?.city || ""}
                    </p>

                    <div className="flex gap-6 mt-2 pt-4 md:border-t md:border-slate-50 w-full md:w-auto justify-center md:justify-start">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Level</p>
                            <p className="text-lg font-bold text-slate-700">12</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Streak</p>
                            <p className="text-lg font-bold text-slate-700">5 Days</p>
                        </div>
                    </div>

                </div>
            </section>
        </section>
    )
}

export default ProfileUsersPage;