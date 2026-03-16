'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ContactPageContent } from '@/types/database';

export function useContactPageContent() {
  const [content, setContent] = useState<ContactPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contact_page')
          .select('*')
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found - table exists but is empty
            console.log('contact_page table exists but has no data');
          } else if (error.code === 'PGRST204') {
            // Table not found
            console.error('contact_page table does not exist. Please run the SQL migration in Supabase.');
            console.error('Error details:', {
              message: error.message,
              code: error.code,
              hint: error.hint,
            });
          } else {
            console.error('Error fetching contact page:', {
              message: error.message,
              code: error.code,
              hint: error.hint,
              details: error.details,
            });
            throw error;
          }
        }
        
        setContent(data || getDefaultContent());
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contact page content:', err);
        setContent(getDefaultContent());
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateContent = async (updates: Partial<ContactPageContent>) => {
    try {
      // Remove id field if it exists (should not update primary key)
      const { id, ...updateData } = updates;

      if (!content) {
        // Create new entry
        console.log('Creating new contact_page entry with:', updateData);
        const { data, error } = await supabase
          .from('contact_page')
          .insert([{ ...getDefaultContent(), ...updateData }])
          .select()
          .single();

        if (error) {
          console.error('Insert error details:', {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details,
          });
          throw error;
        }
        console.log('Successfully created contact_page:', data);
        setContent(data);
      } else {
        // Update existing entry
        console.log('Updating contact_page id:', content.id, 'with data:', updateData);
        const { data, error } = await supabase
          .from('contact_page')
          .update(updateData)
          .eq('id', content.id)
          .select()
          .single();

        if (error) {
          console.error('Update error details:', {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details,
            contentId: content.id,
            updatePayload: updateData,
          });
          throw error;
        }
        console.log('Successfully updated contact_page:', data);
        setContent(data);
      }
      return true;
    } catch (err) {
      console.error('Failed to update contact page content:', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
      }
      return false;
    }
  };

  return { content, loading, error, updateContent };
}

function getDefaultContent(): ContactPageContent {
  return {
    id: 1,
    profile_image_url: '',
    about_text: '',
    skills: [],
    contact_email: '',
    social_links: {},
  };
}
