import { Inventory } from "../data/inventory";
import { BrandAdapter } from "./BrandAdapter";

export class UniqloAdapter implements BrandAdapter {
    async fetchStoreInventory(storeId: string) {
        await new Promise(r => setTimeout(r, 100));

        const uniqloStores = Inventory.Uniqlo as Record<string, any[]>
        const storeItems = uniqloStores[storeId] || []

        return {
            storeId,
            skus: storeItems.map(item => ({
                code: item.sku,
                label: item.name,
                size: item.size,
                stock: Math.floor(Math.random() * 10) + 1
            })),
            ts: Date.now()
        }
    }
}