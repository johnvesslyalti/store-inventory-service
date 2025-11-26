export interface BrandAdapter {
    fetchStoreInventory(storeId: string): Promise<any>;
}
