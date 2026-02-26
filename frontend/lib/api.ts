const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("access");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("API GET failed");
  }

  return res.json();
}

export async function apiPost(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("API POST failed");
  }

  return res.json();
}

export async function apiPatch(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("API PATCH failed");
  }

  return res.json();
}