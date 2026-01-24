// Email confirmation service
// Placeholder endpoint - replace with actual Apps Script URL

const EMAIL_CONFIRMATION_ENDPOINT = "https://script.google.com/macros/s/AKfycbxJ4UL0RXMd8D3e9ZC5Cbeos4LMEenoGJVuNgauosNhYCw7CuO-u0-JzGsThXLhqbLV/exec";

interface EmailPayload {
  formType: "member" | "volunteer" | "collaborator";
  email: string;
  name: string;
  referenceId?: string; // Not included for members
}

export const sendConfirmationEmail = async (payload: EmailPayload): Promise<void> => {
  try {
    await fetch(EMAIL_CONFIRMATION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    // Silently fail - email is a nice-to-have, not critical
    console.error("Email confirmation error:", error);
  }
};
