const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000";

interface ApiError {
  detail?: string;
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

    throw new Error(message);
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
