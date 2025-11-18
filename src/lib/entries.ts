import { supabase } from './supabase';
import type { Entry } from './supabase';

/**
 * Create a new journal entry
 */
export const createEntry = async (
  userId: string,
  entryText: string,
  guidedResponse?: string,
  photoUrl?: string
) => {
  const { data, error } = await supabase
    .from('entries')
    .insert({
      user_id: userId,
      entry_text: entryText,
      guided_response: guidedResponse,
      photo_url: photoUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all entries for a user
 */
export const getUserEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Entry[];
};

/**
 * Get a single entry by ID
 */
export const getEntry = async (entryId: string) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error) throw error;
  return data as Entry;
};

/**
 * Update an entry
 */
export const updateEntry = async (
  entryId: string,
  updates: Partial<Omit<Entry, 'id' | 'user_id' | 'created_at'>>
) => {
  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete an entry
 */
export const deleteEntry = async (entryId: string) => {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId);

  if (error) throw error;
};

/**
 * Get user stats
 */
export const getUserStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};
