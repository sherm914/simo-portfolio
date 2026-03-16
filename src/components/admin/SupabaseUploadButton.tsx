'use client';

import { useState } from 'react';
import { uploadToSupabase } from '@/lib/storageUpload';

interface SupabaseUploadButtonProps {
  label: string;
  folder: string;
  fileType: 'image' | 'video';
  onSuccess: (url: string) => void;
  onError?: (error: string) => void;
  maxFileSize?: number; // in bytes
}

export default function SupabaseUploadButton({
  label,
  folder,
  fileType,
  onSuccess,
  onError,
  maxFileSize = 150 * 1024 * 1024, // 150MB default
}: SupabaseUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
      const errorMsg = `File size exceeds ${sizeMB}MB limit`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log(`Uploading ${fileType} to Supabase...`);
      const url = await uploadToSupabase(file, folder);
      console.log(`Successfully uploaded ${fileType}:`, url);
      onSuccess(url);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error(`Failed to upload ${fileType}:`, err);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const acceptTypes = fileType === 'image' ? 'image/*' : 'video/*';

  return (
    <div>
      <label className="block w-full">
        <input
          type="file"
          accept={acceptTypes}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={(e) => {
            const input = (e.currentTarget.parentElement?.querySelector(
              'input[type="file"]'
            ) as HTMLInputElement);
            input?.click();
          }}
          disabled={uploading}
          className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 hover:border-white transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? '⏳ Uploading...' : `+ Upload ${label}`}
        </button>
      </label>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
