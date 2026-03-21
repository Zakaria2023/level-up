export const createAccessToken = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `${globalThis.crypto.randomUUID()}.${Date.now().toString(36)}`;
  }

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const randomBytes = globalThis.crypto.getRandomValues(new Uint8Array(24));
    const randomToken = Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");

    return `${randomToken}.${Date.now().toString(36)}`;
  }

  throw new Error("Secure token generation is not available.");
};
