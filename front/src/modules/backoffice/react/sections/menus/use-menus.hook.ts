import { useState, useEffect, useCallback } from 'react';
import { BackofficeDomainModel } from '../../../core/model/backoffice.domain-model';
import { IMenuManagementGateway } from '../../../core/gateway/menu-management.gateway';
import { HttpMenuManagementGateway } from '../../../core/gateway/http.menu-management-gateway';
import { HttpClient } from '@taotask/modules/shared/infrastructure/http-client';

// Create a default gateway instance
const httpClient = new HttpClient();
const defaultGateway = new HttpMenuManagementGateway(httpClient);

export interface UseMenusOptions {
    gateway?: IMenuManagementGateway;
}

export const useMenus = (restaurantId: number, options: UseMenusOptions = {}) => {
    const gateway = options.gateway ?? defaultGateway;

    const [menus, setMenus] = useState<BackofficeDomainModel.Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMenus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await gateway.getMenus(restaurantId);
            setMenus(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch menus';
            setError(message);
            console.error('Failed to fetch menus:', err);
        } finally {
            setIsLoading(false);
        }
    }, [restaurantId, gateway]);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const createMenu = async (input: BackofficeDomainModel.CreateMenuDTO) => {
        setError(null);
        try {
            await gateway.createMenu(input);
            await fetchMenus();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create menu';
            setError(message);
            console.error('Failed to create menu:', err);
            throw err;
        }
    };

    const updateMenu = async (id: number, data: BackofficeDomainModel.UpdateMenuDTO) => {
        setError(null);
        try {
            await gateway.updateMenu(id, data);
            await fetchMenus();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update menu';
            setError(message);
            console.error('Failed to update menu:', err);
            throw err;
        }
    };

    const deleteMenu = async (id: number) => {
        setError(null);
        try {
            await gateway.deleteMenu(id);
            await fetchMenus();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete menu';
            setError(message);
            console.error('Failed to delete menu:', err);
            throw err;
        }
    };

    const toggleActive = async (id: number, isActive: boolean) => {
        await updateMenu(id, { isActive });
    };

    return {
        menus,
        isLoading,
        error,
        createMenu,
        updateMenu,
        deleteMenu,
        toggleActive,
        refetch: fetchMenus,
    };
};
