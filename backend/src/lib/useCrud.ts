// src/hooks/useCrud.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Id, ListParams } from '../lib/crudFactory';

type Updater<T> = (prev: T[]) => T[];

export function useCrud<T extends { id: Id }>(
  crud: {
    list: (p?: ListParams) => Promise<{ items: T[]; total: number; page: number; pageSize: number }>;
    create: (d: Omit<T, 'id'>) => Promise<T>;
    update: (id: Id, d: Partial<Omit<T, 'id'>>) => Promise<T>;
    remove: (id: Id) => Promise<any>;
  },
  initial: Partial<ListParams> = { page: 1, pageSize: 20 }
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState(initial.q ?? '');
  const [filters, setFilters] = useState<Record<string, any>>(initial.filters ?? {});
  const [page, setPage] = useState(initial.page ?? 1);
  const [pageSize, setPageSize] = useState(initial.pageSize ?? 20);

  const params = useMemo(() => ({ q, page, pageSize, filters }), [q, page, pageSize, filters]);
  const mounted = useRef(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await crud.list(params);
      if (!mounted.current) return;
      setItems(res.items);
      setTotal(res.total);
    } catch (e: any) {
      if (!mounted.current) return;
      setError(e?.message || 'Fetch failed');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [crud, params]);

  useEffect(() => {
    mounted.current = true;
    fetchList();
    return () => { mounted.current = false; };
  }, [fetchList]);

  const optimistic = (fn: Updater<T>) => setItems(prev => fn(prev));

  const add = useCallback(async (data: Omit<T, 'id'>) => {
    // optimistic ekleme
    const tempId = Date.now();
    optimistic(prev => [{ ...(data as any), id: tempId }, ...prev]);
    try {
      const saved = await crud.create(data);
      optimistic(prev => prev.map(it => (it.id === tempId ? saved : it)));
    } catch (e) {
      // geri al
      optimistic(prev => prev.filter(it => it.id !== tempId));
      throw e;
    }
  }, [crud]);

  const update = useCallback(async (id: Id, data: Partial<Omit<T, 'id'>>) => {
    const before = items;
    optimistic(prev => prev.map(it => (it.id === id ? { ...it, ...data } as T : it)));
    try {
      const saved = await crud.update(id, data);
      optimistic(prev => prev.map(it => (it.id === id ? saved : it)));
    } catch (e) {
      setItems(before);
      throw e;
    }
  }, [crud, items]);

  const remove = useCallback(async (id: Id) => {
    const before = items;
    optimistic(prev => prev.filter(it => it.id !== id));
    try {
      await crud.remove(id);
    } catch (e) {
      setItems(before);
      throw e;
    }
  }, [crud, items]);

  // arama ve filtre yardımcıları
  const setFilter = useCallback((key: string, val: any) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  }, []);

  return {
    items, total, loading, error,
    q, setQ, page, setPage, pageSize, setPageSize, filters, setFilter,
    refetch: fetchList, add, update, remove,
  };
}
