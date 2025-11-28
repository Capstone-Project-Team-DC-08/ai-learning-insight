
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const ProfileTabs = () => {
    const pathname = usePathname();
    

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="flex gap-2 border-b border-slate-100 pb-2">
            <Button 
                variant={isActive('/student/profile') ? 'secondary' : 'outline'} 
                asChild
            >
                <Link href="/student/profile">Focus Time</Link>
            </Button>
            
            <Button 
                variant={isActive('/student/profile/weekly-activity') ? 'secondary' : 'outline'} 
                asChild
            >
                <Link href="/student/profile/weekly-activity">Weekly Activity</Link>
            </Button>
        </nav>
    )
}