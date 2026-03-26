import { supabase } from '@/lib/supabase';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param folder - Folder path (e.g., 'profile', 'portfolio/bts')
 * @returns Public URL of the uploaded file
 */
export async function uploadToSupabase(
  file: File,
  folder: string
): Promise<string> {
  try {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filePath = `${folder}/${filename}`;

    console.log('Uploading file to Supabase:', filePath);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('File uploaded successfully:', data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log('Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('portfolio-images')
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log('File deleted successfully:', filePath);
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
}
