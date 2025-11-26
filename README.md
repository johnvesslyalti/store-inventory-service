Title:

    A real-time inventory aggregation backend that fetches product availabity from multiple brands (H&M, Uniqlo, etc.), normalizes their different data formats, calculates distance from the user, and returns unified results through a single API.

Architecture:

                    ┌────────────────────────────┐
                    │        UI (HTML/JS)        │
                    │ Brand + Store Picker       │
                    │ "Fetch Now" Button         │
                    └─────────────┬──────────────┘
                                 POST /inventory/fetch
                                │
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


This project includes:

    - Brand Adapters (plug and play architecture)
    - Parallel fetching
    - Snapshot persistence (in-memory)
    - Minimal UI (HTML + JS)
    - Fast API (<300ms target)

Features:

    1. Brand Adapter Architecture
        Each Brand has:
            - A seperate adapter class
            - Its own fetch + normalize logic
            - implements a common interface
        This makes it easy to add new branch later (Zara, Puma, etc.) without touching existing code.

    2. Real-Time Inventory Fetching
        Fetches data from 3 simulated branch API's in parallel using Promise.all

    3. Data Normalization
        - Different stores return difference JSON structures.
        - All responses are transformed into a unified model:

            {
                "storeId": "store1",
                "storeName": "H&M",
                "productId": "ABC123",
                "availableQty": 10,
                "price": 1999,
                "lastUpdated": "ISO timestamp",
                "distanceKm": 2.3
            }

    4. Distance Calculation
        - Uses the Haversine formula to compute distance between:
            user's location -> store location
    
    5. Snapshot Persistence
        - Every time data is fetched, a snapshot is stored in-memory.
        - This helps with caching and debugging

    6. Minimal UI
        - A supe-light HTML page that:
            - Accepts product_id, lat, lng
            - Calls /inventory
            - Renders the results inside a table
        
    7. Clean Project Structure
        src/
        adapters/
        services/
        routes/
        types/
        utils/
        ui/

Tech Stack:

    **Layer**   **Technology**

    Runtime     Node.js
    Language    TypeScript
    Framework   Express.js
    Data Simulation Brand Adapters
    Caching     In-memory snapshot store
    UI          HTML + JavaScript
    Test        Jest
    Packaging   npm

Project Structure:

    src/
    ├── adapters/
    │   ├── BrandAdapter.ts
    │   ├── HnMAdapter.ts
    │   ├── UniqloAdapter.ts
    │   └── Store3Adapter.ts
    │
    ├── services/
    │   └── InventoryService.ts
    │
    ├── utils/
    │   └── distance.ts
    │
    ├── routes/
    │   └── inventory.route.ts
    │
    ├── ui/
    │   ├── index.html
    │   ├── script.js
    │   └── styles.css
    │
    ├── snapshots/
    │   └── SnapshotStore.ts
    │
    ├── app.ts
    └── server.ts

API Endpoints:

    GET /inventory
    - Query Params
        product_id=ABC123
        lat=12.9716
        lng=77.5946
    Returns
        
        {
        "productId": "ABC123",
        "count": 3,
        "results": [
            {
            "storeId": "store1",
            "storeName": "H&M",
            "availableQty": 5,
            "price": 1499,
            "lastUpdated": "2024-05-21T10:12:00.234Z",
            "distanceKm": 1.8
            }
        ]
        }

Performance

    - Uses parallel requests
    - In-memory snapshots for repeated queries
    - Lightweight normalization
    - Minimal UI client for testing
    - Target: ~300ms response time for 3 stores.

Minimal UI

    - A simple HTML page (no frameworks) that - allows the user to:
    - enter product ID
    - enter lat/lng
    - trigger API request
    - display results
    - This proves the backend works end-to-end.