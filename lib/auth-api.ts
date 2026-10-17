import { auth, clearLoginFailures, getLoginLockout, recordFailedLogin } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email().max(254),
  password: z.string().min(12).max(128),
});

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(128),
});

function genericError(message: string, status: number, retryAfter?: number | null): Response {
  const headers = new Headers();
  if (retryAfter) headers.set("retry-after", String(retryAfter));
  return Response.json({ error: message }, { status, headers });
}

function logAuthFailure(error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(
      "[auth] request failed",
      error instanceof Error ? { name: error.name, message: error.message } : "Unknown error",
    );
  }
}

async function parseJson(request: Request): Promise<unknown> {
  return request.clone().json().catch(() => undefined);
}

async function callAuthEndpoint(
  request: Request,
  endpoint: "/sign-up/email" | "/sign-in/email",
  body: Record<string, unknown>,
): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  headers.set("content-type", "application/json");

  return auth.handler(
    new Request(new URL(`/api/auth${endpoint}`, request.url), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
  );
}

export async function handleRegister(request: Request): Promise<Response> {
  const parsed = registerSchema.safeParse(await parseJson(request));
  if (!parsed.success) return genericError("Invalid request.", 400);

  try {
    const response = await callAuthEndpoint(request, "/sign-up/email", parsed.data);
    if (!response.ok) {
      return genericError("Unable to create an account with those details.", response.status);
    }
    return response;
  } catch (error) {
    logAuthFailure(error);
    return genericError("Authentication is temporarily unavailable.", 503);
  }
}

export async function handleLogin(request: Request): Promise<Response> {
  const parsed = loginSchema.safeParse(await parseJson(request));
  if (!parsed.success) return genericError("Invalid request.", 400);

  try {
    const retryAfter = await getLoginLockout(parsed.data.email);
    if (retryAfter) {
      return genericError("Unable to sign in. Try again later.", 429, retryAfter);
    }

    const response = await callAuthEndpoint(request, "/sign-in/email", parsed.data);
    if (response.ok) {
      await clearLoginFailures(parsed.data.email);
      return response;
    }

    if (response.status === 401) {
      const lockedFor = await recordFailedLogin(parsed.data.email);
      if (lockedFor) {
        return genericError("Unable to sign in. Try again later.", 429, lockedFor);
      }
    }

    return genericError(
      response.status === 429
        ? "Unable to sign in. Try again later."
        : "Unable to sign in with those credentials.",
      response.status,
      Number(response.headers.get("retry-after")) || null,
    );
  } catch (error) {
    logAuthFailure(error);
    return genericError("Authentication is temporarily unavailable.", 503);
  }
}

export async function handleAuthGet(request: Request): Promise<Response> {
  try {
    return await auth.handler(request);
  } catch (error) {
    logAuthFailure(error);
    return genericError("Authentication is temporarily unavailable.", 503);
  }
}

export async function handleAuthPost(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/^\/api\/auth/, "");
  if (path === "/sign-up/email") return handleRegister(request);
  if (path === "/sign-in/email") return handleLogin(request);

  try {
    const response = await auth.handler(request);
    if (!response.ok) {
      return genericError("Unable to complete this request.", response.status);
    }
    return response;
  } catch (error) {
    logAuthFailure(error);
    return genericError("Authentication is temporarily unavailable.", 503);
  }
}