export const checkPasswordLeak = async (password: string): Promise<number> => {
  try {
    // 1. Hash the password using Web Crypto API (SHA-1)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);

    // 2. Convert ArrayBuffer to Hex String
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 3. Prepare k-Anonymity (Uppercase for the API)
    const hash = hashHex.toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // 4. Query the API securely
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    if (!response.ok) return 0;

    const textData = await response.text();

    // 5. Check results locally
    const lines = textData.split("\n");
    // Ensure we ignore whitespace/carriage returns when matching
    const match = lines.find((line) => line.trim().startsWith(suffix));

    if (match) {
      const count = match.split(":")[1];
      return parseInt(count.trim(), 10);
    }

    return 0; // Safe!
  } catch (error) {
    console.error("Breach check failed:", error);
    return 0; // Fail safe
  }
};
