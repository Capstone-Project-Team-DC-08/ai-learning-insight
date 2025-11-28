"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { se } from 'date-fns/locale'

interface ProfileContentProps {
    user?: {
        name?: string | null;
        city?: string | null;
        image_path?: string | null;
    }
}

export const ProfileContent = ({ user }: ProfileContentProps) => {
    // Kita cukup gunakan satu state untuk input ini
    const [displayName, setDisplayName] = useState("");
    const [cityuser, setCityuser] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(""); // State tambahan untuk avatar biar sinkron

    useEffect(() => {

        if (user) {
            setDisplayName(user.name || "");
            setAvatarUrl(user.image_path || "");
            setCityuser(user.city || "");
            return;
        }

        // 2. Jika Props kosong, coba ambil dari LocalStorage (Fallback)
        if (typeof window !== "undefined") {
            const storedUserStr = localStorage.getItem("user");
            if (storedUserStr) {
                try {
                    const storedData = JSON.parse(storedUserStr);
                    const loadedName = storedData.name
                    const storedCity = storedData.city || "";

                    setCityuser(storedCity);
                    setDisplayName(loadedName);
                    setAvatarUrl(storedData.image_path || storedData.user?.image_path || "");
                } catch (error) {
                    console.error("Gagal parsing data user dari local storage", error);
                }
            }
        }
    }, [user]);

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: displayName,
                    city: cityuser,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Profile updated successfully!");
                // Opsional: Update local storage agar data baru tersimpan di browser juga
                if (typeof window !== "undefined") {
                    const storedUserStr = localStorage.getItem("user");
                    if (storedUserStr) {
                        const storedData = JSON.parse(storedUserStr);
                        // Update display_name di local storage

                        if (storedData.user ) {
                            storedData.user.name = displayName;
                            storedData.user.city = cityuser;
                        } {
                            storedData.name = displayName;
                            storedData.city = cityuser;
                        }
                

                        localStorage.setItem("user", JSON.stringify(storedData));
                    }
                }
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-lg font-medium text-slate-900">Profile</h3>
            </div>
            <Separator />

            <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-2 border-slate-100">
                    <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} />
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Avatar</Button>
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="display_name">Name</Label>
                    <Input
                        id="name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="display_name">Kota</Label>
                    <Input
                        id="city"
                        value={cityuser}
                        onChange={(e) => setCityuser(e.target.value)}
                        placeholder="Enter your City"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}