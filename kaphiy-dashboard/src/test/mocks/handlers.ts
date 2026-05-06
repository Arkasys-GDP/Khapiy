import { http, HttpResponse } from "msw";
import {
  MOCK_ORDERS,
  MOCK_STATS,
  MOCK_HISTORY,
  MOCK_CATEGORIES,
  MOCK_INGREDIENTS,
  MOCK_PRODUCTS,
  MOCK_METRICS,
} from "./seed";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const handlers = [
  // Auth
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { pin?: string };
    if (!body.pin) {
      return HttpResponse.json({ message: "PIN requerido" }, { status: 400 });
    }
    return HttpResponse.json({
      access_token: `mock-jwt-${Date.now()}`,
      barista: { id: 1, name: "Barista de turno" },
    });
  }),

  // Active orders (wire format)
  http.get(`${BASE}/orders/active`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    return HttpResponse.json({ orders: MOCK_ORDERS, stats: MOCK_STATS });
  }),

  // Order kitchen status update
  http.patch(`${BASE}/orders/:id/status`, async ({ params, request }) => {
    const body = (await request.json()) as { kitchenStatus: string };
    return HttpResponse.json({ id: String(params["id"]), status: body.kitchenStatus });
  }),

  // Mark item out of stock (flips parent order to OUT_OF_STOCK)
  http.patch(`${BASE}/order-items/:id/out-of-stock`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params["id"]),
      isAvailable: false,
      orderStatus: "OUT_OF_STOCK",
    });
  }),

  // Order history (wire format, paginated)
  http.get(`${BASE}/orders/history`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    return HttpResponse.json({
      orders: MOCK_HISTORY,
      total: MOCK_HISTORY.length,
      page,
      limit,
    });
  }),

  // Metrics
  http.get(`${BASE}/orders/metrics`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const range = (url.searchParams.get("range") ?? "daily") as "daily" | "weekly" | "monthly";
    return HttpResponse.json({ ...MOCK_METRICS, range });
  }),

  // Categories
  http.get(`${BASE}/categories`, () => HttpResponse.json(MOCK_CATEGORIES)),

  // Ingredients CRUD
  http.get(`${BASE}/ingredients`, () => HttpResponse.json(MOCK_INGREDIENTS)),
  http.post(`${BASE}/ingredients`, async ({ request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = (await request.json()) as { name: string; isAllergen: boolean };
    return HttpResponse.json({ id: 999, ...body }, { status: 201 });
  }),
  http.patch(`${BASE}/ingredients/:id`, async ({ params, request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = (await request.json()) as Partial<{ name: string; isAllergen: boolean }>;
    return HttpResponse.json({ id: Number(params["id"]), name: "X", isAllergen: false, ...body });
  }),
  http.delete(`${BASE}/ingredients/:id`, ({ params, request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({ id: Number(params["id"]) });
  }),

  // Products CRUD
  http.get(`${BASE}/products`, () => HttpResponse.json(MOCK_PRODUCTS)),
  http.post(`${BASE}/products`, async ({ request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: 999, isAvailable: true, ...body }, { status: 201 });
  }),
  http.patch(`${BASE}/products/:id`, async ({ params, request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: Number(params["id"]), name: "X", price: 0, categoryId: 1, isAvailable: true, ...body });
  }),
  http.delete(`${BASE}/products/:id`, ({ params, request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({ id: Number(params["id"]) });
  }),
];
