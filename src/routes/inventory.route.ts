import { Router } from "express";
import { Stores } from "../data/stores";
import { InventoryService } from "../services/InventoryService";
import { Brand } from "../types/Brand";

const router = Router();

// Cast Stores object so TS allows indexing
const TypedStores: Record<Brand, string[]> = Stores as Record<Brand, string[]>;

router.post("/fetch", async (req, res) => {
  try {
    const brand = req.body.brand as Brand;
    const storeId = req.body.storeId as string;

    if (!brand || !storeId) {
      return res.status(400).json({ error: "brand and storeId required" });
    }

    if (!TypedStores[brand] || !TypedStores[brand].includes(storeId)) {
      return res.status(400).json({
        error: `Store ${storeId} does NOT belong to brand ${brand}`
      });
    }

    const { snapshot, fromCache } = await InventoryService.fetchNow(
      brand,
      storeId,
      { force: false }
    );

    res.json({ snapshot, fromCache });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const brand = req.query.brand as Brand;
  const storeId = req.query.storeId as string;

  const snapshot = await InventoryService.getSnapshot(brand, storeId);
  if (!snapshot) return res.status(404).json({ error: "No snapshot found" });

  res.json(snapshot);
});

export default router;
