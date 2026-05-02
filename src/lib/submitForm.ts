// Unified form submitter for Google Apps Script Web App.
// Sends POST with Content-Type: text/plain;charset=utf-8 (required to bypass CORS).
// Expected response shape: { status: "success", data: { generatedId: "..." } }

export const API_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzBBqykKTm_nXlMB8rmay48y1Ab3fGti3XjlmKCa3ASV1KHCwPkLk6Q21JcM0fquF6W/exec";

export type FormType =
  | "Member"
  | "Volunteer"
  | "Pathfinder"
  | "Ambassador"
  | "Collaborator"
  | "CountryUnion";

export interface SubmitResult {
  generatedId: string;
  raw: unknown;
}

export async function submitToAppsScript(
  formType: FormType,
  fields: Record<string, unknown>
): Promise<SubmitResult> {
  const body = { formType, ...fields };

  console.log(`[submitForm] Submitting ${formType}:`, body);

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  console.log(`[submitForm] Response status=${response.status}, body=${text.substring(0, 500)}`);

  if (text.trim().startsWith("<!")) {
    throw new Error("API returned an error page. Please try again.");
  }

  let result: {
    status?: string;
    success?: boolean;
    error?: string;
    message?: string;
    data?: { generatedId?: string; app_id?: string };
    generatedId?: string;
    referenceId?: string;
    app_id?: string;
  };
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("Invalid response from server");
  }

  const ok = result.status === "success" || result.success === true;
  if (!ok) {
    throw new Error(result.error || result.message || "Submission failed");
  }

  const generatedId =
    result.data?.generatedId ||
    result.data?.app_id ||
    result.generatedId ||
    result.app_id ||
    result.referenceId ||
    "";

  return { generatedId, raw: result };
}
