const Stores = {
    HnM: ["hnm-001", "hnm-002"],
    Uniqlo: ["uniqlo-001"],
    Store3: ["store3-001"]
};

function updateStores() {
    const brand = document.getElementById("brand").value;
    const storeSelect = document.getElementById("store");
    storeSelect.innerHTML = "";
    Stores[brand].forEach(id => {
        const opt = document.createElement("option");
        opt.value = opt.innerText = id;
        storeSelect.appendChild(opt);
    });
}

document.addEventListener("DOMContentLoaded", updateStores);

async function fetchNow() {
    const brand = document.getElementById("brand").value;
    const storeId = document.getElementById("store").value;

    const res1 = await fetch("/inventory/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, storeId })
    });

    const { snapshot, fromCache } = await res1.json();

    document.getElementById("cacheInfo").innerText =
        fromCache ? "From Cache: YES" : "From Cache: NO";

    document.getElementById("lastRefreshed").innerText =
        "Last Refreshed At: " + snapshot.lastRefreshedAt;

    const last = new Date(snapshot.lastRefreshedAt);
    document.getElementById("timeAgo").innerText =
        "Refreshed: " +
        Math.floor((Date.now() - last.getTime()) / 1000) +
        " seconds ago";

    const res2 = await fetch(`/inventory?brand=${brand}&storeId=${storeId}`);
    const data = await res2.json();

    const tbody = document.getElementById("body");
    tbody.innerHTML = "";

    data.items.forEach(i => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${i.sku}</td>
      <td>${i.name}</td>
      <td>${i.size}</td>
      <td>${i.qty}</td>
    `;
        tbody.appendChild(tr);
    });
}
