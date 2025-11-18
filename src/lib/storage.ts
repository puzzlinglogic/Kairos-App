import { supabase } from './supabase';

/**
 * Upload a photo to Supabase storage
 */
export const uploadPhoto = async (
  userId: string,
  file: File
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('journal-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage
    .from('journal-photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

/**
 * Delete a photo from Supabase storage
 */
export const deletePhoto = async (photoUrl: string): Promise<void> => {
  // Extract file path from URL
  const url = new URL(photoUrl);
  const pathParts = url.pathname.split('/journal-photos/');
  if (pathParts.length < 2) throw new Error('Invalid photo URL');

  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from('journal-photos')
    .remove([filePath]);

  if (error) throw error;
};

/**
 * Compress image before upload (to reduce file size)
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
