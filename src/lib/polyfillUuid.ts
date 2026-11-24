/**
 * crypto.randomUUID 兼容垫片。
 *
 * 浏览器只在「安全上下文」（HTTPS 或 localhost）下提供 crypto.randomUUID。
 * 用 http://<IP>:25774 这类明文地址访问面板时该函数不存在，
 * 会导致页面抛 `crypto.randomUUID is not a function` 并白屏。
 *
 * crypto.getRandomValues 在非安全上下文下仍然可用，因此在这里补一个
 * 符合 RFC 4122 v4 的实现。
 */
const g = globalThis as unknown as { crypto?: Crypto };

if (g.crypto && typeof g.crypto.randomUUID !== "function") {
  Object.defineProperty(g.crypto, "randomUUID", {
    configurable: true,
    writable: true,
    value: function randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
      const bytes = new Uint8Array(16);
      g.crypto!.getRandomValues(bytes);
      // version 4
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      // variant 10xx
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex: string[] = [];
      for (let i = 0; i < 16; i += 1) {
        hex.push(bytes[i].toString(16).padStart(2, "0"));
      }
      return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
        .slice(6, 8)
        .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}` as
        `${string}-${string}-${string}-${string}-${string}`;
    },
  });
}

export {};
