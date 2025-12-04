"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfileTabs = () => {
    const pathname = usePathname();

    return (
        <Tabs defaultValue={pathname} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="/student/profile" asChild>
                    <Link href="/student/profile">
                        Focus Time
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="/student/profile/weekly-activity" asChild>
                    <Link href="/student/profile/weekly-activity">
                        Weekly Activity
                    </Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}