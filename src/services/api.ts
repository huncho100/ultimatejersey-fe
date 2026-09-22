const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000";

interface ApiError {
  detail?: string;
}

/**
 * An unsuccessful HTTP response.
 *
 * Extends Error, and carries the same message the
 * plain Error used to, so existing callers that
 * only read .message keep working. Callers that
 * need to tell "not found" from "server is down"
 * can read .status.
 */
export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "ApiRequestError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  if (!response.ok) {
    let message = "Something went wrong.";
    const responseBody = await response.text();

    try {
      const error = JSON.parse(responseBody) as ApiError;
      message = error.detail || message;
    } catch {
      message = responseBody || message;
    }

    throw new ApiRequestError(
      message,
      response.status
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function authenticatedRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options?.headers || {}),
    },
  });
}
