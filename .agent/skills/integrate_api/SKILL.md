---
name: integrate_api
description: Integrating APIs using Axios and React Query in the Frontend
---

# Skill: API Integration (React Query & Axios)

Use this skill to create services that call backend endpoints and consume them in the React UI.

## Steps

### 1. Create a Fetcher Service (Axios)
Create a function that handles raw HTTP calls without *React rules*. Store it in `src/services/` or `src/api/`.

```typescript
// src/services/userServices.ts
import axios from 'axios';
// (or use the project's internal axios instance located at src/api/apiClient.ts)

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
  const { data } = await axios.get('/api/users');
  return data;
};
```

### 2. Create a Custom Hook (React Query)
Create an abstraction in the form of React Hooks using `@tanstack/react-query` for caching and UI integration. It is highly recommended to place these in `src/hooks/` or alongside their respective service files.

```typescript
// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/userServices';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],     // Unique key for React Query cache management
    queryFn: fetchUsers,     // API service call
    staleTime: 5 * 60 * 1000 // Optional: How long data is considered fresh
  });
};
```

### 3. Implement in Component
Call the *custom hook* without manually managing `isLoading`, `isError`, or `data` via `useState`.

```tsx
// src/pages/UsersPage.tsx
import { useUsers } from '@/hooks/useUsers';

export function UsersPage() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading data...</div>;
  if (error) return <div>An error occurred while loading data.</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}
```

## Golden Rules
- Never call API fetch inside `useEffect`.
- `queryKey` must be represented as an array and be descriptive enough (e.g., `['users', userId, { filter: 'active' }]`).
- Export TypeScript interfaces to validate Response and Request Bodies.
