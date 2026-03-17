'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { PortfolioItem } from '@/types/database';

export function usePortfolioItems() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*');

        if (error) throw error;
        setItems(data || []);
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[usePortfolioItems] Fetched ${data?.length || 0} total items from database`);
          console.debug(`[usePortfolioItems] All items:`, data?.map(item => ({ id: item.id, title: item.title, featured: item.featured })));
          const featuredItems = data?.filter(item => item.featured) || [];
          console.debug(`[usePortfolioItems] Featured items (${featuredItems.length}):`, featuredItems.map(item => ({ id: item.id, title: item.title })));
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio items');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    // Real-time subscription using the new API
    const subscription = supabase
      .channel('portfolio_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [...prev, payload.new as PortfolioItem]);
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) =>
                item.id === (payload.new as PortfolioItem).id ? (payload.new as PortfolioItem) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((item) => item.id !== (payload.old as PortfolioItem).id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { items, loading, error };
}
