'use client';
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, QrCode } from 'lucide-react';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useTables } from './use-tables.hook';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';

interface TablesSectionProps {
    restaurantId: number;
}

export const TablesSection: React.FC<TablesSectionProps> = ({ restaurantId }) => {
    const { tables, isLoading, createTable, deleteTable, updateTable } = useTables(restaurantId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<BackofficeDomainModel.Table | null>(null);
    const [formData, setFormData] = useState({ title: '', capacity: 2 });
    const [qrModalTable, setQrModalTable] = useState<{ id: number; title: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'number' ? parseInt(target.value, 10) : target.value;
        setFormData((prev) => ({ ...prev, [target.name]: value }));
    };

    const handleCreate = async () => {
        await createTable({
            restaurantId,
            title: formData.title,
            capacity: formData.capacity,
        });
        setFormData({ title: '', capacity: 2 });
        setIsCreateModalOpen(false);
    };

    const handleEdit = (table: BackofficeDomainModel.Table) => {
        setEditingTable(table);
        setFormData({ title: table.title, capacity: table.capacity });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingTable) return;
        await updateTable(editingTable.id, {
            title: formData.title,
            capacity: formData.capacity,
        });
        setFormData({ title: '', capacity: 2 });
        setEditingTable(null);
        setIsEditModalOpen(false);
    };

    const handleDelete = async (tableId: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer cette table ?')) {
            await deleteTable(tableId);
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTable(null);
        setFormData({ title: '', capacity: 2 });
    };

    const getTableOrderUrl = (tableId: number) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}/terminal?table=${tableId}&restaurant=${restaurantId}`;
    };

    const downloadQR = () => {
        if (!qrModalTable) return;
        const svg = document.getElementById('qr-code-svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.download = `qr-table-${qrModalTable.title}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des tables...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Tables ({tables.length})
                </h2>
                <LuxuryButton onClick={() => setIsCreateModalOpen(true)}>+ Ajouter</LuxuryButton>
            </div>

            {tables.length === 0 ? (
                <div className="text-center py-12 text-luxury-text-secondary">
                    Aucune table pour ce restaurant. Commencez par en creer une.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map((table) => (
                        <LuxuryCard key={table.id} hoverable>
                            <h3 className="text-lg font-semibold text-luxury-text-primary mb-2">
                                {table.title}
                            </h3>
                            <p className="text-luxury-gold-muted mb-4">
                                {table.capacity} {table.capacity > 1 ? 'couverts' : 'couvert'}
                            </p>
                            <div className="flex gap-2">
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => setQrModalTable({ id: table.id, title: table.title })}
                                >
                                    <QrCode className="w-4 h-4" />
                                </LuxuryButton>
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => handleEdit(table)}
                                >
                                    Modifier
                                </LuxuryButton>
                                <LuxuryButton
                                    variant="destructive"
                                    onClick={() => handleDelete(table.id)}
                                >
                                    Supprimer
                                </LuxuryButton>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <LuxuryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nouvelle table"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom de la table"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Table VIP 1"
                        required
                    />
                    <LuxuryInput
                        label="Capacite"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        min={1}
                        required
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleCreate}>Creer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>

            {/* Edit Modal */}
            <LuxuryModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Modifier la table"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom de la table"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Table VIP 1"
                        required
                    />
                    <LuxuryInput
                        label="Capacite"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        min={1}
                        required
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleUpdate}>Enregistrer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={closeEditModal}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>

            {/* QR Code Modal */}
            <LuxuryModal
                isOpen={!!qrModalTable}
                onClose={() => setQrModalTable(null)}
                title={`QR Code - ${qrModalTable?.title}`}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={qrModalTable ? getTableOrderUrl(qrModalTable.id) : ''}
                            size={200}
                            level="H"
                        />
                    </div>
                    <p className="text-xs text-luxury-text-secondary text-center break-all max-w-[300px]">
                        {qrModalTable && getTableOrderUrl(qrModalTable.id)}
                    </p>
                    <div className="flex gap-4">
                        <LuxuryButton onClick={downloadQR}>
                            <Download className="w-4 h-4 mr-2" />
                            Telecharger
                        </LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimer
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </div>
    );
};
