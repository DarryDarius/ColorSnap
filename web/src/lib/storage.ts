import type { CartItem } from "./types";

const UPLOADED_PHOTO_KEY = "uploadedPhoto";
const SHOPPING_CART_KEY = "shoppingCart";

export function getUploadedPhoto(): string | null {
  return localStorage.getItem(UPLOADED_PHOTO_KEY);
}

export function setUploadedPhoto(dataUrl: string): void {
  localStorage.setItem(UPLOADED_PHOTO_KEY, dataUrl);
}

export function clearUploadedPhoto(): void {
  localStorage.removeItem(UPLOADED_PHOTO_KEY);
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getCart(): CartItem[] {
  const raw = localStorage.getItem(SHOPPING_CART_KEY);
  const parsed = safeJsonParse<unknown>(raw);
  if (!Array.isArray(parsed)) return [];

  const items: CartItem[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;

    const name = typeof obj.name === "string" ? obj.name : null;
    const image = typeof obj.image === "string" ? obj.image : null;
    const description = typeof obj.description === "string" ? obj.description : "";

    let price: number | null = null;
    if (typeof obj.price === "number") price = obj.price;
    if (typeof obj.price === "string") {
      const n = Number(obj.price);
      price = Number.isFinite(n) ? n : null;
    }

    if (!name || !image || price === null) continue;
    items.push({ name, image, price, description });
  }

  return items;
}

export function setCart(items: CartItem[]): void {
  localStorage.setItem(SHOPPING_CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem): void {
  const existing = getCart();
  existing.push(item);
  setCart(existing);
}

export function clearCart(): void {
  setCart([]);
}


