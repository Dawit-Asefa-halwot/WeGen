export interface CustomUserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'FUNDRAISER' | 'ORGANIZATION_ADMIN' | 'ORGANIZATION_MEMBER' | 'DONOR';
  orgSlug?: string;
  orgName?: string;
  campaignType?: 'me' | 'other' | 'org';
  registeredAt: string;
}

const STORAGE_KEY = 'wegen_custom_users';

export function getCustomUsers(): CustomUserAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomUser(data: Omit<CustomUserAccount, 'id' | 'registeredAt'> & { id?: string }): CustomUserAccount {
  if (typeof window === 'undefined') {
    return { ...data, id: 'temp-id', registeredAt: new Date().toISOString() };
  }
  try {
    const users = getCustomUsers();
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );

    const newUser: CustomUserAccount = {
      ...data,
      id: data.id || (existingIndex >= 0 ? users[existingIndex].id : `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`),
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      registeredAt: existingIndex >= 0 ? users[existingIndex].registeredAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser;
  } catch {
    return { ...data, id: 'fallback-id', registeredAt: new Date().toISOString() };
  }
}

export function findCustomUserByEmail(email: string): CustomUserAccount | undefined {
  const users = getCustomUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function authenticateCustomUser(email: string, password: string): CustomUserAccount | null {
  const users = getCustomUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (found && found.password === password) {
    return found;
  }
  return null;
}
