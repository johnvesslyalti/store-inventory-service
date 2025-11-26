import { HnMAdapter } from "../adapters/HnMAdapter";
import { UniqloAdapter } from "../adapters/UniqloAdapter";
import { Store3Adapter } from "../adapters/Store3Adapter";
import { saveSnapshot, getSnapshot } from "../snapshots/SnapshotStore";
import { Brand } from "../types/Brand";

const adapters: Record<Brand, any> = {
    HnM: new HnMAdapter(),
    Uniqlo: new UniqloAdapter(),
    Store3: new Store3Adapter()
};

export class InventoryService {
    static async fetchNow(brand: Brand, storeId: string, { force = false } = {}) {
        if (!force) {
            const cached = getSnapshot(brand, storeId);
            if (cached) {
                return { snapshot: cached, fromCache: true };
            }
        }

        const adapter = adapters[brand];
        const raw = await adapter.fetchStoreInventory(storeId);

        const normalized = this.normalize(brand, raw);

        const snapshot = {
            brand,
            storeId,
            items: normalized,
            lastRefreshedAt: new Date().toISOString()
        };

        saveSnapshot(brand, storeId, snapshot);

        return { snapshot, fromCache: false };
    }

    static async getSnapshot(brand: Brand, storeId: string) {
        return getSnapshot(brand, storeId);
    }

    static normalize(brand: Brand, raw: any) {
        if (brand === "HnM") {
            return raw.items; // items already typed
        }

        if (brand === "Uniqlo") {
            return raw.skus.map((s: any) => ({
                sku: s.code,
                name: s.label,
                size: s.size,
                qty: s.stock
            }));
        }

        if (brand === "Store3") {
            return raw.inventory.map((i: any) => ({
                sku: i.id,
                name: i.title,
                size: i.size,
                qty: i.qty
            }));
        }

        return [];
    }
}
