# 📦 Store Inventory Service

A lightweight backend service + minimal UI that fetches **store-specific inventory** from multiple brands using the **Adapter Pattern**, normalizes the data, stores snapshots in memory, and exposes APIs to trigger and fetch snapshots.

---

## 🏗 Architecture Overview

```
                 ┌───────────────────────────┐
                 │        UI (HTML/JS)        │
                 │ Brand + Store Picker       │
                 │ "Fetch Now" Button         │
                 └─────────────┬─────────────┘
                               │ POST /inventory/fetch
                               ▼
               ┌────────────────────────────────────┐
               │        InventoryService            │
               │  - Calls Brand Adapters            │
               │  - Normalizes Data                 │
               │  - Stores Snapshots (in-memory)    │
               └─────────────┬──────────────────────┘
                             │
                ┌────────────┴─────────────────┐
                │       Brand Adapters         │
                │ (HnM, Uniqlo, Store3, …)     │
                │   fetchStoreInventory()      │
                └────────────┬─────────────────┘
                             │
                     Returns brand-specific raw data
                             │
                             ▼
              ┌─────────────────────────────────────┐
              │     SnapshotStore (in-memory)        │
              │  { brand → storeId → lastSnapshot }  │
              └─────────────────────────────────────┘

```

Each brand has its own raw response format → adapters convert them to a unified shape.

---

## 🚀 Features

* Adapter Pattern for H&M, Uniqlo, Store3
* Store-specific inventory
* Snapshot caching
* Minimal UI with:

  * Brand dropdown
  * Store dropdown
  * Fetch button
  * “From Cache” indicator
  * Last refreshed time
  * Seconds-ago refresh timer
* Zero external DB required

---

## 🛠 How to Run

```bash
git clone <repo-url>
cd store-inventory-service
npm install
npm run dev
```

Server runs at:

```
http://localhost:3000
```

UI:

```
open src/ui/index.html in browser
```

---

## 📡 API Endpoints

### 1) **POST /inventory/fetch**

Triggers an on-demand refresh for a brand + store.

#### Request

```json
{
  "brand": "HnM",
  "storeId": "hnm-001",
  "force": false
}
```

#### Response

```json
{
  "snapshot": {
    "brand": "HnM",
    "storeId": "hnm-001",
    "items": [
      { "sku": "HNM-TS-001", "name": "Cotton Tee", "size": "M", "qty": 7 },
      { "sku": "HNM-JN-002", "name": "Slim Jeans", "size": "L", "qty": 3 }
    ],
    "lastRefreshedAt": "2025-01-24T10:25:32.120Z"
  },
  "fromCache": false
}
```

---

### 2) **GET /inventory?brand=&storeId=**

Returns the **latest snapshot** saved for that brand/store.

#### Example Request

```
GET /inventory?brand=Uniqlo&storeId=uniqlo-001
```

#### Example Response

```json
{
  "brand": "Uniqlo",
  "storeId": "uniqlo-001",
  "items": [
    { "sku": "UQ-AIR-001", "name": "Airism Tee", "size": "M", "qty": 5 },
    { "sku": "UQ-STRETCH-002", "name": "Ultra Stretch Jeans", "size": "32", "qty": 8 }
  ],
  "lastRefreshedAt": "2025-01-24T10:26:55.982Z"
}
```

---

## 🧩 Normalized Item Format

All brand adapters normalize inventory to this unified shape:

```ts
{
  sku: string;
  name: string;
  size: string;
  qty: number;
}
```

---

## 🎨 Minimal UI Preview

The UI lets you:

* Choose **Brand**
* Choose **Store**
* Click **Fetch Now**
* See:

  * From Cache: YES/NO
  * Last Refreshed At
  * Refreshed: X seconds ago
* View table of SKUs

---

## 📌 Folder Structure

```
src/
  adapters/
  data/
  routes/
  services/
  snapshots/
  types/
  ui/