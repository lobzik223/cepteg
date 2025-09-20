// src/lib/crudFactory.ts
import { api } from './api';

export type Id = number | string;

export type ListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean | undefined>;
};

export type ListResult<T> = { items: T[]; total: number; page: number; pageSize: number };

export function createCrud<T extends { id: Id }>(resource: string) {
  return {
    list: (params: ListParams = {}) => {
      const qs = new URLSearchParams();
      if (params.q) qs.set('q', params.q);
      if (params.page) qs.set('page', String(params.page));
      if (params.pageSize) qs.set('pageSize', String(params.pageSize));
      if (params.filters) {
        Object.entries(params.filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
        });
      }
      const s = qs.toString();
      return api.get<ListResult<T>>(`/${resource}${s ? `?${s}` : ''}`);
    },
    create: (data: Omit<T, 'id'>) => api.post<T>(`/${resource}`, data),
    update: (id: Id, data: Partial<Omit<T, 'id'>>) => api.patch<T>(`/${resource}/${id}`, data),
    remove: (id: Id) => api.del<{ ok: true }>(`/${resource}/${id}`),
  };
}
