// src/api/client.ts
type Opts = { method?: string; body?: any; token?: string };

// Mock data
const mock = {
  categories: [{ id: 1, name: "İçecekler" }, { id: 2, name: "Yiyecekler" }],
  products: [{ id: 1, name: "Limonata", price: 45.0 }, { id: 2, name: "Kahve", price: 55.0 }],
  tables: [{ id: 1, code: "M01", qrcodeUrl: "" }],
  orders: [{ id: 1, table: { code: "M01" }, status: "New", total: 100.0 }],
};

export async function api(path: string, opts: Opts = {}) {
  // basit bekleme simülasyonu
  await new Promise(r => setTimeout(r, 300));

  if (path.startsWith("/categories")) {
    if (opts.method === "POST") {
      mock.categories.push({ id: Date.now(), name: opts.body?.name });
    }
    return { data: mock.categories };
  }
  if (path.startsWith("/products")) {
    if (opts.method === "POST") {
      mock.products.push({ id: Date.now(), name: opts.body?.name, price: opts.body?.price });
    }
    return { data: mock.products };
  }
  if (path.startsWith("/tables")) {
    if (opts.method === "POST") {
      mock.tables.push({ id: Date.now(), code: opts.body?.code, qrcodeUrl: "" });
    }
    return { data: mock.tables };
  }
  if (path.startsWith("/orders")) {
    return { data: mock.orders };
  }

  return { data: [] };
}
/*
const BASE_URL = "https://senin-gercek-api.com";
export async function api(path: string, opts: any = {}) {
  const headers: Record<string,string> = { "Content-Type": "application/json" };
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
*/

