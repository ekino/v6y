'use client';

import { useLogout } from 'ra-core';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@v6y/ui-kit-front';

import { resources } from '../core/resources/index.ts';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const location = useLocation();
    const logout = useLogout();

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 shrink-0 border-r bg-muted/30 p-4">
                <h2 className="mb-4 text-lg font-semibold">V6Y Back-office</h2>
                <nav className="space-y-1">
                    {resources.map((resource) => {
                        const active = location.pathname.startsWith(`/${resource.name}`);
                        return (
                            <Link
                                key={resource.name}
                                to={`/${resource.name}`}
                                className={cn(
                                    'block rounded-md px-3 py-2 text-sm hover:bg-muted',
                                    active && 'bg-muted font-medium',
                                )}
                            >
                                {resource.label}
                            </Link>
                        );
                    })}
                </nav>
                <button
                    type="button"
                    onClick={() => logout()}
                    className="mt-6 text-sm text-muted-foreground hover:underline"
                >
                    Log out
                </button>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
