import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useReel = () => {
  const [reel, setReel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reelId, setReelId] = useState<string>('');

  useEffect(() => {
    fetchReel();
  }, []);

  const fetchReel = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('site_reel')
        .select('id, video_url')
        .single();

      if (err) throw err;
      setReelId(data?.id || '');
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
      if (!reelId) throw new Error('Reel ID not found');

      const { error: err } = await supabase
        .from('site_reel')
        .update({ video_url: videoUrl, updated_at: new Date().toISOString() })
        .eq('id', reelId);

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
