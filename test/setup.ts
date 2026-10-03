import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// lib/core/fetch.ts captures the API base URL at module load time, so make
// sure it is defined before any test module imports it.
process.env.NEXT_PUBLIC_BASE_URL ||= "http://api.test.local/api/v1";

/* ---------------------------------------------------------------------------
 * Minimal browser API polyfills required by Radix UI / next-themes in jsdom.
 * Only the APIs actually touched by the components under test are stubbed.
 * ------------------------------------------------------------------------- */

// jsdom has no ResizeObserver (used by Radix popper/positioning code).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// jsdom implements neither matchMedia nor the pointer-capture APIs.
if (typeof window.matchMedia === "undefined") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

Element.prototype.scrollIntoView ??= () => {};
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};

// jsdom does not ship PointerEvent (Radix listens for it).
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
    }
  }
  window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}

document.elementFromPoint ??= () => null;

// jsdom's window.alert is "not implemented" — replace it with a spy so tests
// can assert the user-facing fallback message.
window.alert = vi.fn() as unknown as typeof window.alert;