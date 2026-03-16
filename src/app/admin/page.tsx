'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ContactPageEditor from '@/components/admin/ContactPageEditor';
import ReelEditor from '@/components/admin/ReelEditor';
import SupabaseUploadButton from '@/components/admin/SupabaseUploadButton';
import type { PortfolioItem } from '@/types/database';

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Featured' | 'Directing' | 'Editorial' | 'VFX' | 'Production'>('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [] as string[],
    type: 'MUSIC VIDEO' as const,
    featured: false,
    slug: '',
    image_url: '',
    video_url: '',
    roles: '',
    about: '',
    bts_images: [] as string[],
    bts_videos: [] as string[],
  });
  const [editFormData, setEditFormData] = useState<PortfolioItem | null>(null);
  const [uploadingBtsImageIndex, setUploadingBtsImageIndex] = useState<number | null>(null);
  const [uploadingBtsVideoIndex, setUploadingBtsVideoIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tempOrderedItems, setTempOrderedItems] = useState<PortfolioItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'contact-page' | 'reel'>('portfolio');

  const categories = ['Directing', 'Editorial', 'VFX', 'Production'] as const;
  const types = ['MUSIC VIDEO', 'COMMERCIAL', 'NARRATIVE'] as const;

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Ensure body can always scroll (fix for Cloudinary modal locking scroll)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'auto';
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update grid items when category filter changes
  useEffect(() => {
    if (viewMode === 'grid') {
      setTempOrderedItems(getItemsByCategory());
      setDraggedItemId(null);
      setHoveredIndex(null);
      setHasUnsavedChanges(false);
    }
  }, [selectedCategory, viewMode, items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.currentTarget;
    const name = target.name;

    let value: any;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const addBtsImageSlot = () => {
    setFormData((prev) => ({
      ...prev,
      bts_images: [...prev.bts_images, ''],
    }));
  };

  const removeBtsImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bts_images: prev.bts_images.filter((_, i) => i !== index),
    }));
  };

  const handleBtsImageUpload = (index: number) => (result: any) => {
    if (result.event === 'success') {
      setFormData((prev) => {
        const newImages = [...prev.bts_images];
        newImages[index] = result.info.secure_url;
        return { ...prev, bts_images: newImages };
      });
    }
  };

  const addBtsVideoSlot = () => {
    setFormData((prev) => ({
      ...prev,
      bts_videos: [...prev.bts_videos, ''],
    }));
  };

  const removeBtsVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bts_videos: prev.bts_videos.filter((_, i) => i !== index),
    }));
  };

  const moveBtsImageUp = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const newImages = [...prev.bts_images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return { ...prev, bts_images: newImages };
    });
  };

  const moveBtsImageDown = (index: number) => {
    if (index === formData.bts_images.length - 1) return;
    setFormData((prev) => {
      const newImages = [...prev.bts_images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return { ...prev, bts_images: newImages };
    });
  };

  const moveBtsVideoUp = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const newVideos = [...prev.bts_videos];
      [newVideos[index - 1], newVideos[index]] = [newVideos[index], newVideos[index - 1]];
      return { ...prev, bts_videos: newVideos };
    });
  };

  const moveBtsVideoDown = (index: number) => {
    if (index === formData.bts_videos.length - 1) return;
    setFormData((prev) => {
      const newVideos = [...prev.bts_videos];
      [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
      return { ...prev, bts_videos: newVideos };
    });
  };

  // Edit handlers for BTS reordering
  const moveBtsImageUpEdit = (index: number) => {
    if (!editFormData || index === 0) return;
    const newImages = [...(editFormData.bts_images || [])];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setEditFormData({ ...editFormData, bts_images: newImages });
  };

  const moveBtsImageDownEdit = (index: number) => {
    if (!editFormData || index === (editFormData.bts_images || []).length - 1) return;
    const newImages = [...(editFormData.bts_images || [])];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setEditFormData({ ...editFormData, bts_images: newImages });
  };

  const moveBtsVideoUpEdit = (index: number) => {
    if (!editFormData || index === 0) return;
    const newVideos = [...(editFormData.bts_videos || [])];
    [newVideos[index - 1], newVideos[index]] = [newVideos[index], newVideos[index - 1]];
    setEditFormData({ ...editFormData, bts_videos: newVideos });
  };

  const moveBtsVideoDownEdit = (index: number) => {
    if (!editFormData || index === (editFormData.bts_videos || []).length - 1) return;
    const newVideos = [...(editFormData.bts_videos || [])];
    [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
    setEditFormData({ ...editFormData, bts_videos: newVideos });
  };

  const handleBtsVideoUpload = (index: number) => (result: any) => {
    if (result.event === 'success') {
      setFormData((prev) => {
        const newVideos = [...prev.bts_videos];
        newVideos[index] = result.info.secure_url;
        return { ...prev, bts_videos: newVideos };
      });
    }
  };

  // Edit handlers for BTS items
  const addBtsImageSlotEdit = () => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      bts_images: [...(editFormData.bts_images || []), ''],
    });
  };

  const removeBtsImageEdit = (index: number) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      bts_images: (editFormData.bts_images || []).filter((_, i) => i !== index),
    });
  };

  const handleBtsImageUploadEdit = (index: number) => (result: any) => {
    if (result.event !== 'success') return;
    setEditFormData((prev) => {
      if (!prev) return prev;
      const newImages = [...(prev.bts_images || [])];
      newImages[index] = result.info.secure_url;
      return { ...prev, bts_images: newImages };
    });
  };

  const addBtsVideoSlotEdit = () => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      bts_videos: [...(editFormData.bts_videos || []), ''],
    });
  };

  const removeBtsVideoEdit = (index: number) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      bts_videos: (editFormData.bts_videos || []).filter((_, i) => i !== index),
    });
  };

  const handleBtsVideoUploadEdit = (index: number) => (result: any) => {
    if (result.event !== 'success') return;
    setEditFormData((prev) => {
      if (!prev) return prev;
      const newVideos = [...(prev.bts_videos || [])];
      newVideos[index] = result.info.secure_url;
      return { ...prev, bts_videos: newVideos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.categories.length === 0) {
        throw new Error('Please select at least one category');
      }

      if (!formData.title.trim()) {
        throw new Error('Please enter a project title');
      }

      const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Initialize category_orders: assign order within each selected category
      const category_orders: { [key: string]: number | null } = {
        'Directing': null,
        'Editorial': null,
        'VFX': null,
        'Production': null,
      };

      formData.categories.forEach((cat) => {
        const itemsInCategory = items.filter(i => i.categories.includes(cat));
        const maxOrderInCat = itemsInCategory.length > 0 
          ? Math.max(...itemsInCategory.map(i => i.category_orders?.[cat as keyof typeof i.category_orders] ?? -1))
          : -1;
        category_orders[cat] = maxOrderInCat + 1;
      });
      
      const insertData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categories: formData.categories,
        type: formData.type,
        featured: formData.featured,
        slug: slug,
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        roles: formData.roles.trim() || null,
        about: formData.about.trim() || null,
        bts_images: formData.bts_images.filter(url => url.trim()),
        bts_videos: formData.bts_videos.filter(url => url.trim()),
        category_orders: category_orders,
      };

      console.log('Inserting:', insertData);

      const { data, error } = await supabase.from('portfolio_items').insert([insertData]).select();

      if (error) {
        console.error('Database error details:', error);
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error(`Slug "${slug}" already exists. Please use a different slug or title.`);
        }
        throw new Error(error.message || 'Database insertion failed');
      }

      console.log('Insert successful:', data);

      // Reset form
      setFormData({
        title: '',
        description: '',
        categories: [],
        type: 'MUSIC VIDEO',
        featured: false,
        slug: '',
        image_url: '',
        video_url: '',
        roles: '',
        about: '',
        bts_images: [],
        bts_videos: [],
      });

      alert('Portfolio item added successfully!');
      
      // Reload items
      fetchItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item';
      console.error('Error details:', error);
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const getItemsByCategory = () => {
    if (selectedCategory === 'All') {
      return items;
    }
    if (selectedCategory === 'Featured') {
      return items
        .filter((p) => p.featured)
        .sort((a, b) => {
          const firstCatA = a.categories[0] as keyof typeof a.category_orders;
          const firstCatB = b.categories[0] as keyof typeof b.category_orders;
          const orderA = a.category_orders?.[firstCatA] ?? Infinity;
          const orderB = b.category_orders?.[firstCatB] ?? Infinity;
          return (orderA as number) - (orderB as number);
        });
    }
    return items
      .filter((p) => p.categories.includes(selectedCategory))
      .sort((a, b) => {
        const orderA = a.category_orders?.[selectedCategory] ?? Infinity;
        const orderB = b.category_orders?.[selectedCategory] ?? Infinity;
        return (orderA as number) - (orderB as number);
      });
  };

  const reorderItems = async (itemId: number, direction: 'up' | 'down') => {
    const categoryItems = getItemsByCategory();
    const currentIndex = categoryItems.findIndex(i => i.id === itemId);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === categoryItems.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentItem = categoryItems[currentIndex];
    const targetItem = categoryItems[targetIndex];

    if (!currentItem || !targetItem) return;

    // Determine which category key to use for ordering
    let categoryKey: keyof typeof currentItem.category_orders;
    if (selectedCategory === 'Featured') {
      // For featured items, use the first category for ordering
      categoryKey = (currentItem.categories[0] || 'Directing') as keyof typeof currentItem.category_orders;
    } else {
      categoryKey = selectedCategory as keyof typeof currentItem.category_orders;
    }

    const tempOrder = currentItem.category_orders?.[categoryKey];

    try {
      // Update current item
      const updatedCurrentOrders = { ...(currentItem.category_orders || {}) };
      updatedCurrentOrders[categoryKey] = targetItem.category_orders?.[categoryKey];
      
      await supabase
        .from('portfolio_items')
        .update({ category_orders: updatedCurrentOrders })
        .eq('id', currentItem.id);

      // Update target item
      const updatedTargetOrders = { ...(targetItem.category_orders || {}) };
      updatedTargetOrders[categoryKey] = tempOrder;
      
      await supabase
        .from('portfolio_items')
        .update({ category_orders: updatedTargetOrders })
        .eq('id', targetItem.id);

      // Fetch fresh data from database to ensure consistency
      await fetchItems();
    } catch (error) {
      console.error('Failed to reorder items:', error);
      alert('Failed to reorder items');
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: number) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredIndex(index);
  };

  const handleDragLeave = () => {
    setHoveredIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemId === null) return;

    const currentItems = viewMode === 'grid' ? tempOrderedItems : getItemsByCategory();
    const draggedIndex = currentItems.findIndex(i => i.id === draggedItemId);
    
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedItemId(null);
      setHoveredIndex(null);
      return;
    }

    // Reorder the items
    const newItems = [...currentItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setTempOrderedItems(newItems);
    setHasUnsavedChanges(true);
    setDraggedItemId(null);
    setHoveredIndex(null);
  };

  const saveOrderChanges = async () => {
    try {
      setLoading(true);
      const itemsToUpdate = viewMode === 'grid' ? tempOrderedItems : getItemsByCategory();
      
      for (let i = 0; i < itemsToUpdate.length; i++) {
        const item = itemsToUpdate[i];
        let categoryKey: keyof typeof item.category_orders;
        
        if (selectedCategory === 'Featured') {
          categoryKey = (item.categories[0] || 'Directing') as keyof typeof item.category_orders;
        } else {
          categoryKey = selectedCategory as keyof typeof item.category_orders;
        }

        const updatedOrders = { ...(item.category_orders || {}) };
        updatedOrders[categoryKey] = i;

        await supabase
          .from('portfolio_items')
          .update({ category_orders: updatedOrders })
          .eq('id', item.id);
      }

      await fetchItems();
      setHasUnsavedChanges(false);
      setTempOrderedItems([]);
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Failed to save order changes');
    } finally {
      setLoading(false);
    }
  };

  const initializeGridView = () => {
    setViewMode('grid');
    setTempOrderedItems(getItemsByCategory());
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    const target = e.target;
    const name = target.name;
    const value = 'value' in target ? target.value : '';
    const isCheckbox = target instanceof HTMLInputElement && target.type === 'checkbox';
    setEditFormData({
      ...editFormData,
      [name]: isCheckbox ? (target as HTMLInputElement).checked : value,
    });
  };

  const handleEditCategoryChange = (category: string) => {
    if (!editFormData) return;
    setEditFormData((prev) => {
      if (!prev) return prev;
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };



  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    setLoading(true);
    try {
      // Generate slug if not provided
      let slug = editFormData.slug;
      if (!slug) {
        slug = editFormData.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }

      // Initialize category_orders for any new categories
      const newCategoryOrders = { ...editFormData.category_orders };
      editFormData.categories.forEach((category) => {
        if (!(category in newCategoryOrders)) {
          newCategoryOrders[category as keyof typeof newCategoryOrders] = null;
        }
      });

      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        categories: editFormData.categories,
        type: editFormData.type,
        featured: editFormData.featured,
        slug: slug,
        image_url: editFormData.image_url,
        video_url: editFormData.video_url,
        roles: editFormData.roles,
        about: editFormData.about,
        bts_images: (editFormData.bts_images || []).filter(url => url.trim()),
        bts_videos: (editFormData.bts_videos || []).filter(url => url.trim()),
        category_orders: newCategoryOrders,
      };

      console.log('Current editFormData:', editFormData);
      console.log('Updating with data:', updateData);
      console.log('Image URL being sent:', editFormData.image_url);
      console.log('Video URL being sent:', editFormData.video_url);

      const { error } = await supabase
        .from('portfolio_items')
        .update(updateData)
        .eq('id', editFormData.id);

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful for project ID:', editFormData.id);

      // Update local state
      const updatedItems = items.map((item) =>
        item.id === editFormData.id
          ? { ...editFormData, slug, category_orders: newCategoryOrders }
          : item
      );
      setItems(updatedItems);

      // Reset edit mode
      setEditingId(null);
      setEditFormData(null);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'portfolio'
                ? 'text-white border-b-2 border-white mb-[-1px]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('contact-page')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'contact-page'
                ? 'text-white border-b-2 border-white mb-[-1px]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Contact Page
          </button>
          <button
            onClick={() => setActiveTab('reel')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'reel'
                ? 'text-white border-b-2 border-white mb-[-1px]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Landing Reel
          </button>
        </div>

        {/* Contact Page Tab */}
        {activeTab === 'contact-page' && (
          <div className="mb-12">
            <ContactPageEditor />
          </div>
        )}

        {/* Reel Tab */}
        {activeTab === 'reel' && (
          <div className="mb-12">
            <ReelEditor />
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <>
            {/* Form */}
            <div className="bg-zinc-900 rounded-lg p-8 mb-12 border border-zinc-800">
              {editingId ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    value={editFormData?.title || ''}
                    onChange={handleEditInputChange}
                    required
                    className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                  <input
                    type="text"
                    name="slug"
                    placeholder="Slug (auto-generated from title if empty)"
                    value={editFormData?.slug || ''}
                    onChange={handleEditInputChange}
                    className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={editFormData?.description || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Image</label>
                    <SupabaseUploadButton
                      label="Featured Image"
                      folder="portfolio/images"
                      fileType="image"
                      onSuccess={(url) => {
                        setEditFormData((prev) => {
                          if (!prev) return prev;
                          return { ...prev, image_url: url };
                        });
                      }}
                      onError={(error) => {
                        console.error('Image upload error:', error);
                      }}
                    />
                    {editFormData?.image_url && (
                      <p className="text-xs text-zinc-400 mt-2 truncate">{editFormData.image_url}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Video File</label>
                    <SupabaseUploadButton
                      label="Upload Video"
                      folder="portfolio/videos"
                      fileType="video"
                      maxFileSize={100 * 1024 * 1024}
                      onSuccess={(url) => {
                        setEditFormData((prev) => {
                          if (!prev) return prev;
                          return { ...prev, video_url: url };
                        });
                      }}
                      onError={(error) => {
                        console.error('Video upload error:', error);
                      }}
                    />
                    {editFormData?.video_url && (
                      <p className="text-xs text-zinc-400 mt-2 truncate">{editFormData.video_url}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Roles</label>
                  <input
                    type="text"
                    name="roles"
                    placeholder="e.g., Director, Producer"
                    value={editFormData?.roles || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">About Project</label>
                  <textarea
                    name="about"
                    placeholder="Brief description of the project..."
                    value={editFormData?.about || ''}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="font-semibold mb-4">Behind the Scenes - Images</h3>
                  
                  {(editFormData?.bts_images || []).map((url, index) => (
                    <div key={`edit-bts-img-${index}`} className="mb-4 p-4 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex justify-between items-start mb-3">
                        <label className="block text-sm font-medium">BTS Image {index + 1}</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveBtsImageUpEdit(index)}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBtsImageDownEdit(index)}
                            disabled={index === (editFormData?.bts_images || []).length - 1}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBtsImageEdit(index)}
                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {url ? (
                        <div className="mb-3">
                          <img src={url} alt={`BTS ${index + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                          <p className="text-xs text-zinc-400 truncate">{url}</p>
                        </div>
                      ) : (
                        <SupabaseUploadButton
                          label={`BTS Image ${index + 1}`}
                          folder="portfolio/bts-images"
                          fileType="image"
                          maxFileSize={10 * 1024 * 1024}
                          onSuccess={(url) => {
                            setEditFormData((prev) => {
                              if (!prev) return prev;
                              const newImages = [...(prev.bts_images || [])];
                              newImages[index] = url;
                              return { ...prev, bts_images: newImages };
                            });
                          }}
                          onError={(error) => {
                            console.error('BTS image upload error:', error);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addBtsImageSlotEdit}
                    className="w-full px-4 py-2 bg-zinc-700 rounded border border-zinc-600 hover:border-white transition text-sm mb-6"
                  >
                    + Add Another Image
                  </button>

                  <h3 className="font-semibold mb-4">Behind the Scenes - Videos</h3>
                  
                  {(editFormData?.bts_videos || []).map((url, index) => (
                    <div key={`edit-bts-vid-${index}`} className="mb-4 p-4 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex justify-between items-start mb-3">
                        <label className="block text-sm font-medium">BTS Video {index + 1}</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveBtsVideoUpEdit(index)}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBtsVideoDownEdit(index)}
                            disabled={index === (editFormData?.bts_videos || []).length - 1}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBtsVideoEdit(index)}
                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {url ? (
                        <div className="mb-3">
                          <video src={url} controls className="w-full h-32 rounded mb-2 bg-black" />
                          <p className="text-xs text-zinc-400 truncate">{url}</p>
                        </div>
                      ) : (
                        <SupabaseUploadButton
                          label={`BTS Video ${index + 1}`}
                          folder="portfolio/bts-videos"
                          fileType="video"
                          maxFileSize={100 * 1024 * 1024}
                          onSuccess={(url) => {
                            setEditFormData((prev) => {
                              if (!prev) return prev;
                              const newVideos = [...(prev.bts_videos || [])];
                              newVideos[index] = url;
                              return { ...prev, bts_videos: newVideos };
                            });
                          }}
                          onError={(error) => {
                            console.error('BTS video upload error:', error);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addBtsVideoSlotEdit}
                    className="w-full px-4 py-2 bg-zinc-700 rounded border border-zinc-600 hover:border-white transition text-sm"
                  >
                    + Add Another Video
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Categories (select at least one)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editFormData?.categories.includes(cat) || false}
                          onChange={() => handleEditCategoryChange(cat)}
                          className="w-4 h-4 rounded"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    name="type"
                    value={editFormData?.type || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editFormData?.featured || false}
                    onChange={handleEditInputChange}
                    className="w-4 h-4"
                  />
                  <span>Featured Project</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-white text-black rounded font-bold hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-6 py-3 bg-zinc-800 text-white rounded font-bold hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                  <input
                    type="text"
                    name="slug"
                    placeholder="Slug (auto-generated from title if empty)"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Image</label>
                    <SupabaseUploadButton
                      label="Featured Image"
                      folder="portfolio/images"
                      fileType="image"
                      onSuccess={(url) => {
                        setFormData((prev) => ({
                          ...prev,
                          image_url: url,
                        }));
                      }}
                      onError={(error) => {
                        console.error('Image upload error:', error);
                      }}
                    />
                    {formData.image_url && (
                      <p className="text-xs text-zinc-400 mt-2 truncate">{formData.image_url}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Video File</label>
                    <SupabaseUploadButton
                      label="Upload Video"
                      folder="portfolio/videos"
                      fileType="video"
                      maxFileSize={100 * 1024 * 1024}
                      onSuccess={(url) => {
                        setFormData((prev) => ({
                          ...prev,
                          video_url: url,
                        }));
                      }}
                      onError={(error) => {
                        console.error('Video upload error:', error);
                      }}
                    />
                    {formData.video_url && (
                      <p className="text-xs text-zinc-400 mt-2 truncate">{formData.video_url}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Roles</label>
                  <input
                    type="text"
                    name="roles"
                    placeholder="e.g., Director, Producer"
                    value={formData.roles}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">About Project</label>
                  <textarea
                    name="about"
                    placeholder="Brief description of the project..."
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="font-semibold mb-4">Behind the Scenes - Images</h3>
                  
                  {formData.bts_images.map((url, index) => (
                    <div key={`bts-img-${index}`} className="mb-4 p-4 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex justify-between items-start mb-3">
                        <label className="block text-sm font-medium">BTS Image {index + 1}</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveBtsImageUp(index)}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBtsImageDown(index)}
                            disabled={index === formData.bts_images.length - 1}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBtsImage(index)}
                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {url ? (
                        <div className="mb-3">
                          <img src={url} alt={`BTS ${index + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                          <p className="text-xs text-zinc-400 truncate">{url}</p>
                        </div>
                      ) : (
                        <SupabaseUploadButton
                          label={`BTS Image ${index + 1}`}
                          folder="portfolio/bts-images"
                          fileType="image"
                          maxFileSize={10 * 1024 * 1024}
                          onSuccess={(url) => {
                            const newImages = [...formData.bts_images];
                            newImages[index] = url;
                            setFormData({ ...formData, bts_images: newImages });
                          }}
                          onError={(error) => {
                            console.error('BTS image upload error:', error);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addBtsImageSlot}
                    className="w-full px-4 py-2 bg-zinc-700 rounded border border-zinc-600 hover:border-white transition text-sm mb-6"
                  >
                    + Add Another Image
                  </button>

                  <h3 className="font-semibold mb-4">Behind the Scenes - Videos</h3>
                  
                  {formData.bts_videos.map((url, index) => (
                    <div key={`bts-vid-${index}`} className="mb-4 p-4 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex justify-between items-start mb-3">
                        <label className="block text-sm font-medium">BTS Video {index + 1}</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveBtsVideoUp(index)}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBtsVideoDown(index)}
                            disabled={index === formData.bts_videos.length - 1}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBtsVideo(index)}
                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {url ? (
                        <div className="mb-3">
                          <video src={url} controls className="w-full h-32 rounded mb-2 bg-black" />
                          <p className="text-xs text-zinc-400 truncate">{url}</p>
                        </div>
                      ) : (
                        <SupabaseUploadButton
                          label={`BTS Video ${index + 1}`}
                          folder="portfolio/bts-videos"
                          fileType="video"
                          maxFileSize={100 * 1024 * 1024}
                          onSuccess={(url) => {
                            const newVideos = [...formData.bts_videos];
                            newVideos[index] = url;
                            setFormData({ ...formData, bts_videos: newVideos });
                          }}
                          onError={(error) => {
                            console.error('BTS video upload error:', error);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addBtsVideoSlot}
                    className="w-full px-4 py-2 bg-zinc-700 rounded border border-zinc-600 hover:border-white transition text-sm"
                  >
                    + Add Another Video
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Categories (select at least one)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(cat)}
                          onChange={() => handleCategoryToggle(cat)}
                          className="w-4 h-4 rounded"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Featured Project</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-white text-black rounded font-bold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Project'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Projects List */}
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition ${viewMode === 'list' ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                📋 List
              </button>
              <button
                onClick={initializeGridView}
                className={`px-4 py-2 rounded transition ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                📐 Grid
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-white"
              >
                <option value="All">All Projects</option>
                <option value="Featured">Featured Only</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchItems}
              className="mt-8 px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition"
            >
              Refresh
            </button>
            {hasUnsavedChanges && (
              <button
                onClick={saveOrderChanges}
                disabled={loading}
                className="mt-8 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Saving...' : '💾 Save Order'}
              </button>
            )}
          </div>

          {getItemsByCategory().length === 0 ? (
            <p className="text-zinc-400">No projects found{selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}. Add your first project above!</p>
          ) : viewMode === 'list' ? (
            // LIST VIEW
            <div className="space-y-4">
              {getItemsByCategory().map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800 rounded p-4 border border-zinc-700"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-zinc-400 text-sm">
                        {item.categories.join(', ')} • {item.type}
                      </p>
                      <p className="text-zinc-300 mt-2">{item.description}</p>
                      {item.video_url && (
                        <a
                          href={item.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300"
                        >
                          📹 Watch Video
                        </a>
                      )}
                      {item.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-600 text-xs rounded ml-2">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditFormData({
                            ...item,
                            roles: item.roles || '',
                            about: item.about || '',
                            bts_images: item.bts_images || [],
                            bts_videos: item.bts_videos || [],
                          });
                        }}
                        className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => reorderItems(item.id, 'up')}
                        disabled={getItemsByCategory().indexOf(item) === 0}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => reorderItems(item.id, 'down')}
                        disabled={getItemsByCategory().indexOf(item) === getItemsByCategory().length - 1}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this project?')) {
                            supabase.from('portfolio_items').delete().eq('id', item.id);
                            setItems((prev) => prev.filter((i) => i.id !== item.id));
                          }
                        }}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // GRID VIEW
            <div>
              <p className="text-zinc-400 text-sm mb-4">Drag and drop to reorder projects. They will appear in this layout on your portfolio page.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max">
                {tempOrderedItems.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`rounded overflow-hidden border-2 transition-all duration-200 cursor-move ${
                      draggedItemId === item.id
                        ? 'opacity-50 scale-105 border-blue-400 shadow-lg'
                        : hoveredIndex === index
                        ? 'border-blue-400 bg-zinc-700'
                        : 'border-zinc-700 bg-zinc-800 hover:border-white'
                    }`}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-zinc-700 flex items-center justify-center text-zinc-500">
                        No Image
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 truncate">{item.title}</h3>
                      <p className="text-zinc-400 text-xs mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditFormData({
                              ...item,
                              roles: item.roles || '',
                              about: item.about || '',
                              bts_images: item.bts_images || [],
                              bts_videos: item.bts_videos || [],
                            });
                          }}
                          className="w-full px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700 transition text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this project?')) {
                              supabase.from('portfolio_items').delete().eq('id', item.id);
                              setItems((prev) => prev.filter((i) => i.id !== item.id));
                            }
                          }}
                          className="w-full px-2 py-1 bg-red-600 rounded hover:bg-red-700 transition text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      {item.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-600 text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
