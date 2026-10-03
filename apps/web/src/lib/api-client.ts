const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<{ success: boolean; data?: T; message?: string; errors?: any }> {
  const { token, headers, ...customConfig } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  } else if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('wegen_token');
    if (storedToken) {
      reqHeaders['Authorization'] = `Bearer ${storedToken}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: reqHeaders,
      ...customConfig,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred during request',
        errors: data.errors || null,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to WeGen API',
    };
  }
}
