import { useState, useEffect } from 'react';
import { useReel } from '@/hooks/useReel';
import SupabaseUploadButton from './SupabaseUploadButton';

export default function ReelEditor() {
  const { reel, loading, error, updateReel } = useReel();
  const [uploading, setUploading] = useState(false);

  const handleReelUpload = async (url: string) => {
    setUploading(true);
    try {
      const success = await updateReel(url);
      if (success) {
        alert('Reel updated successfully!');
      } else {
        alert('Failed to update reel');
      }
    } catch (err) {
      console.error('Reel upload error:', err);
      alert('Error updating reel');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-400">Loading reel settings...</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6">Landing Page Reel</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Reel Video</label>
          <p className="text-xs text-zinc-400 mb-4">
            Upload your main reel video (MP4, MOV, etc.)
          </p>
          <SupabaseUploadButton
            label="Upload Reel Video"
            folder="portfolio/reel"
            fileType="video"
            maxFileSize={500 * 1024 * 1024}
            onSuccess={(url) => handleReelUpload(url)}
            onError={(error) => {
              console.error('Reel upload error:', error);
              alert(`Upload error: ${error}`);
            }}
          />
        </div>

        {reel && (
          <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-400 mb-3">Current Reel:</p>
            <video
              src={reel}
              controls
              className="w-full max-h-80 rounded bg-black"
            />
            <p className="text-xs text-zinc-500 mt-3 truncate">{reel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
