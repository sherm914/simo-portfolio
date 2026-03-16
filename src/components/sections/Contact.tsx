'use client';

import { useState } from 'react';
import { useContactPageContent } from '@/hooks/useContactPageContent';

export default function Contact() {
  const { content } = useContactPageContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add email service integration (emailjs, nodemailer, etc.)
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="pt-24 pb-8 px-6 bg-zinc-900">
      <div className="max-w-full mx-auto">
        <h2 className="text-5xl font-bold text-white mb-8 px-6">Let&apos;s Work Together</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <div>
            <p className="text-lg text-zinc-300 mb-8">
              Have a project in mind? I&apos;d love to hear about it. Get in touch and let&apos;s create something amazing together.
            </p>
            
            <div className="space-y-6">
              {content?.contact_email && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a href={`mailto:${content.contact_email}`} className="text-zinc-400 hover:text-white transition">
                    {content.contact_email}
                  </a>
                </div>
              )}
              {content?.social_links && Object.keys(content.social_links).length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Follow</h3>
                  <ul className="space-y-2 text-zinc-400">
                    {content.social_links.instagram && (
                      <li><a href={content.social_links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a></li>
                    )}
                    {content.social_links.linkedin && (
                      <li><a href={content.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a></li>
                    )}
                    {content.social_links.twitter && (
                      <li><a href={content.social_links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a></li>
                    )}
                    {content.social_links.youtube && (
                      <li><a href={content.social_links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">YouTube</a></li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-white focus:outline-none transition"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-white focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-white font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-white focus:outline-none transition"
                placeholder="Project subject"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-white font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-white focus:outline-none transition resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
