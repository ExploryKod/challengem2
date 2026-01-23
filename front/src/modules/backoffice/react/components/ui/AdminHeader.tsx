'use client';

import React from 'react';
import Link from 'next/link';
import { logoutAction } from '@taotask/modules/auth/react/actions/logout.action';

export const AdminHeader: React.FC = () => {
    return (
        <header className="bg-luxury-bg-secondary border-b border-luxury-gold-border">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <Link
                        href="/admin"
                        className="text-xl font-serif text-luxury-gold hover:text-luxury-gold/80 transition-colors"
                    >
                        Administration
                    </Link>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm uppercase tracking-wider text-luxury-text-secondary hover:text-luxury-rose border border-luxury-gold-border hover:border-luxury-rose rounded-lg transition-all duration-200"
                        >
                            Deconnexion
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
};
