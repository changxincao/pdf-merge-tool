import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  return `${(bytes / 1024).toFixed(1)}KB`
}

export function createSafeBlobURL(
  data: Uint8Array | ArrayBuffer | Blob | number[],
  type: string
): string {
  let blob: Blob
  if (data instanceof Blob) {
    blob = data
  } else if (data instanceof Uint8Array) {
    const ab = new ArrayBuffer(data.byteLength)
    const view = new Uint8Array(ab)
    view.set(data)
    blob = new Blob([ab], { type })
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type })
  } else if (Array.isArray(data)) {
    const u8 = new Uint8Array(data)
    blob = new Blob([u8.buffer], { type })
  } else {
    const u8 = new Uint8Array(0)
    blob = new Blob([u8.buffer], { type })
  }
  return URL.createObjectURL(blob)
}

export function revokeSafeBlobURL(url: string): void {
  try { URL.revokeObjectURL(url) } catch {}
}
