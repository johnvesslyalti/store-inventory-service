import { Inventory } from "../data/inventory";
import { BrandAdapter } from "./BrandAdapter";

export class Store3Adapter implements BrandAdapter {
    async fetchStoreInventory(storeId: string) {
        await new Promise(r => setTimeout(r, 140));

        const Store3stores = Inventory.Store3 as Record<string, any[]>
        const storeItems = Store3stores[storeId] || []

        return {
            store: storeId,
            inventory: storeItems.map(item => ({
                id: item.sku,
                title: item.name,
                size: item.size,
                qty: Math.floor(Math.random() * 10) + 1
            })),
            updated: new Date().toISOString()
        }
    }
}