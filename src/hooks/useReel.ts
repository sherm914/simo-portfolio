import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useReel = () => {
  const [reel, setReel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReel();
  }, []);

  const fetchReel = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('site_reel')
        .select('video_url')
        .single();

      if (err) throw err;
      setReel(data?.video_url || '');
      setError(null);
    } catch (err) {
      console.error('Error fetching reel:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reel');
    } finally {
      setLoading(false);
    }
  };

  const updateReel = async (videoUrl: string) => {
    try {
      setLoading(true);
      const { error: err } = await supabase
        .from('site_reel')
        .update({ video_url: videoUrl, updated_at: new Date().toISOString() })
        .eq('id', (await supabase.from('site_reel').select('id').single()).data?.id);

      if (err) throw err;
      setReel(videoUrl);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating reel:', err);
      setError(err instanceof Error ? err.message : 'Failed to update reel');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reel, loading, error, updateReel, refetch: fetchReel };
};
