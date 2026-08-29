const API_URL = import.meta.env.PUBLIC_API_URL || '';


export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function setToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/admin/login';
    throw new Error('Token expirado o inválido');
  }

  return response;
}

export async function login(username: string, password: string): Promise<{ access_token: string }> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error de autenticación' }));
    throw new Error(error.detail || 'Credenciales incorrectas');
  }

  return response.json();
}

export function logout(): void {
  removeToken();
  window.location.href = '/admin/login';
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/admin/login';
  }
}
