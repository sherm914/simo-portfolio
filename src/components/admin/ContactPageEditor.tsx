'use client';

import { useState, useEffect } from 'react';
import { useContactPageContent } from '@/hooks/useContactPageContent';
import SupabaseUploadButton from '@/components/admin/SupabaseUploadButton';
import type { ContactPageContent } from '@/types/database';

export default function ContactPageEditor() {
  const { content, loading, updateContent } = useContactPageContent();
  const [formData, setFormData] = useState<Partial<ContactPageContent>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (content) {
      setFormData({
        ...content,
        social_links: {
          instagram: (content.social_links?.instagram as string) || '',
          linkedin: (content.social_links?.linkedin as string) || '',
          twitter: (content.social_links?.twitter as string) || '',
          youtube: (content.social_links?.youtube as string) || '',
        },
      });
    }
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    
    // Sanitize data before saving
    const sanitizedData: Partial<ContactPageContent> = {
      profile_image_url: formData.profile_image_url || '',
      about_text: formData.about_text || '',
      contact_email: formData.contact_email || '',
      skills: Array.isArray(formData.skills) ? formData.skills : [],
      social_links: {
        instagram: formData.social_links?.instagram || '',
        linkedin: formData.social_links?.linkedin || '',
        twitter: formData.social_links?.twitter || '',
        youtube: formData.social_links?.youtube || '',
      },
    };

    console.log('Saving sanitized data:', sanitizedData);
    const success = await updateContent(sanitizedData);
    setSaving(false);
    
    if (success) {
      setSuccessMessage('Contact page updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage('Failed to save contact page. Check browser console for details.');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index),
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        instagram: (prev.social_links?.instagram as string) || '',
        linkedin: (prev.social_links?.linkedin as string) || '',
        twitter: (prev.social_links?.twitter as string) || '',
        youtube: (prev.social_links?.youtube as string) || '',
        [platform]: value,
      },
    }));
  };

  if (loading) {
    return <div className="text-white">Loading contact page content...</div>;
  }

  return (
    <div className="bg-zinc-800 p-8 rounded-lg max-w-4xl">
      <h2 className="text-3xl font-bold text-white mb-8">Edit Contact Page</h2>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-900 text-red-100 rounded">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-900 text-green-100 rounded">
          {successMessage}
        </div>
      )}

      {/* Profile Image Upload */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-4">Profile Image</label>
        {formData.profile_image_url && (
          <img
            src={formData.profile_image_url}
            alt="Profile"
            className="w-48 h-48 object-contain rounded-lg mb-4"
          />
        )}
        <SupabaseUploadButton
          label="Profile Image"
          folder="contact-page"
          fileType="image"
          onSuccess={(url) => {
            setFormData((prev) => ({
              ...prev,
              profile_image_url: url,
            }));
            setSuccessMessage('Profile image uploaded successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
          onError={(error) => {
            console.error('Failed to upload image:', error);
            setErrorMessage('Failed to upload image. Please try again.');
          }}
        />
      </div>

      {/* About Text */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">About Text</label>
        <textarea
          value={formData.about_text || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, about_text: e.target.value }))}
          className="w-full h-24 p-3 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-blue-500 focus:outline-none"
          placeholder="Tell about yourself..."
        />
      </div>

      {/* Contact Email */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Contact Email</label>
        <input
          type="email"
          value={formData.contact_email || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
          className="w-full p-3 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-blue-500 focus:outline-none"
          placeholder="your@email.com"
        />
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-4">Social Links</label>
        <div className="space-y-3">
          {['instagram', 'linkedin', 'twitter', 'youtube'].map((platform) => (
            <div key={platform}>
              <label className="text-zinc-300 text-sm capitalize">{platform}</label>
              <input
                type="text"
                value={(formData.social_links?.[platform as keyof typeof formData.social_links] as string) || ''}
                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-blue-500 focus:outline-none mt-1"
                placeholder={`Enter your ${platform} URL`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Skills/Tags */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-4">Skills/Tags</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            className="flex-1 p-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-blue-500 focus:outline-none"
            placeholder="Add a skill..."
          />
          <button
            onClick={handleAddSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.skills || []).map((skill, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(index)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
