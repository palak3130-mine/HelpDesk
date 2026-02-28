const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("access");
}

function getRefreshToken() {
  return localStorage.getItem("refresh");
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();

  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await res.json();
  localStorage.setItem("access", data.access);

  return data.access;
}

async function fetchWithAuth(endpoint: string, options: any = {}) {
  let access = getAccessToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Try refreshing token
    access = await refreshAccessToken();

    return fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
        ...options.headers,
      },
    });
  }

  return res;
}

export async function apiGet(endpoint: string) {
  const res = await fetchWithAuth(endpoint);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData?.detail || errorData?.error || "GET failed";
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiPost(endpoint: string, body: any) {
  const res = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData?.detail || errorData?.error || "POST failed";
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiPatch(endpoint: string, body: any) {
  const res = await fetchWithAuth(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // Handle various error formats from Django
    let errorMsg = "PATCH failed";
    if (errorData?.detail) {
      errorMsg = errorData.detail;
    } else if (errorData?.error) {
      errorMsg = errorData.error;
    } else if (typeof errorData === 'object') {
      // Handle field-level errors
      const firstError = Object.values(errorData)[0];
      if (firstError) {
        errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }
    throw new Error(errorMsg);
  }
  return res.json();
}