import { useState, useEffect, useCallback } from 'react';

export interface Menu {
    id: number;
    restaurantId: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
    items: MenuItem[];
}

export interface MenuItem {
    id: number;
    mealType: string;
    quantity: number;
}

export interface CreateMenuInput {
    restaurantId: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    items?: { mealType: string; quantity: number }[];
}

export const useMenus = (restaurantId: number) => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMenus = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/menus?restaurantId=${restaurantId}`);
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        } finally {
            setIsLoading(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const createMenu = async (input: CreateMenuInput) => {
        try {
            await fetch('/api/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });
            await fetchMenus();
        } catch (error) {
            console.error('Failed to create menu:', error);
        }
    };

    const updateMenu = async (id: number, data: Partial<Menu>) => {
        try {
            await fetch(`/api/menus/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            await fetchMenus();
        } catch (error) {
            console.error('Failed to update menu:', error);
        }
    };

    const deleteMenu = async (id: number) => {
        try {
            await fetch(`/api/menus/${id}`, { method: 'DELETE' });
            await fetchMenus();
        } catch (error) {
            console.error('Failed to delete menu:', error);
        }
    };

    const toggleActive = async (id: number, isActive: boolean) => {
        await updateMenu(id, { isActive });
    };

    return {
        menus,
        isLoading,
        createMenu,
        updateMenu,
        deleteMenu,
        toggleActive,
    };
};
