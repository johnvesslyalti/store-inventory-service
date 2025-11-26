import { Inventory } from "../data/inventory";
import { BrandAdapter } from "./BrandAdapter";

export class HnMAdapter implements BrandAdapter {
    async fetchStoreInventory(storeId: string) {
        await new Promise(r => setTimeout(r, 120));

        const HnMStores = Inventory.HnM as Record<string, any[]>
        const storeItems = HnMStores[storeId] || [];

        return {
            storeId,
            items: storeItems.map(item => ({
                ...item,
                qty: Math.floor(Math.random() * 10) + 1
            })),
            lastRefreshedAt: new Date().toISOString()
        }
    }
}