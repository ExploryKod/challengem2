import { AdminHeader } from '@taotask/modules/backoffice/react/components/ui/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-luxury-bg-primary">
            <AdminHeader />
            {children}
        </div>
    );
}
