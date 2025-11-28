"use client"

import React from 'react'
import ProfileUsersPage from './components/profileUsers';
import { ProfileTabs } from './components/ProfileTabs';


const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <section>     
            <ProfileUsersPage />
            <section>
                <section className=' flex gap-3'>
                    <ProfileTabs />
                </section>
                {children}
            </section>

        </section>
    )
}

export default layout