export interface PortfolioItem {
  id: number;
  slug: string; // used for routing
  title: string;
  category: 'Directing' | 'Editorial' | 'VFX' | 'Production';
  type: 'MUSIC VIDEO' | 'COMMERCIAL' | 'NARRATIVE';
  description: string;
  featured?: boolean; // highlight in the top grid
  image?: string;
  videoUrl?: string;
  link?: string;
}

export const portfolioItems: PortfolioItem[] = [
  // featured (highlighted) projects – choose up to six
  {
    id: 1,
    slug: 'project-title-1',
    title: 'Project Title 1',
    category: 'Directing',
    type: 'MUSIC VIDEO',
    description: 'Brief description of your project',
    featured: true
  },
  {
    id: 2,
    slug: 'project-title-2',
    title: 'Project Title 2',
    category: 'VFX',
    type: 'COMMERCIAL',
    description: 'Brief description of your project',
    featured: true
  },
  {
    id: 3,
    slug: 'project-title-3',
    title: 'Project Title 3',
    category: 'Production',
    type: 'NARRATIVE',
    description: 'Brief description of your project',
    featured: true
  },
  {
    id: 4,
    slug: 'project-title-4',
    title: 'Project Title 4',
    category: 'Editorial',
    type: 'COMMERCIAL',
    description: 'Brief description of your project',
    featured: true
  },
  {
    id: 5,
    slug: 'project-title-5',
    title: 'Project Title 5',
    category: 'Editorial',
    type: 'MUSIC VIDEO',
    description: 'Brief description of your project',
    featured: true
  },
  {
    id: 6,
    slug: 'project-title-6',
    title: 'Project Title 6',
    category: 'VFX',
    type: 'NARRATIVE',
    description: 'Brief description of your project',
    featured: true
  },
  // additional projects that will appear in the full grid
  {
    id: 7,
    slug: 'project-title-7',
    title: 'Project Title 7',
    category: 'Directing',
    type: 'COMMERCIAL',
    description: 'Another completed project'
  },
  {
    id: 13,
    slug: 'project-title-13',
    title: 'Project Title 13',
    category: 'Directing',
    type: 'NARRATIVE',
    description: 'Another completed project'
  },
  {
    id: 8,
    slug: 'project-title-8',
    title: 'Project Title 8',
    category: 'Editorial',
    type: 'MUSIC VIDEO',
    description: 'Another completed project'
  },
  {
    id: 9,
    slug: 'project-title-9',
    title: 'Project Title 9',
    category: 'Editorial',
    type: 'NARRATIVE',
    description: 'Another completed project'
  },
  {
    id: 10,
    slug: 'project-title-10',
    title: 'Project Title 10',
    category: 'VFX',
    type: 'COMMERCIAL',
    description: 'Another completed project'
  },
  {
    id: 11,
    slug: 'project-title-11',
    title: 'Project Title 11',
    category: 'Editorial',
    type: 'COMMERCIAL',
    description: 'Another completed project'
  },
  {
    id: 12,
    slug: 'project-title-12',
    title: 'Project Title 12',
    category: 'Production',
    type: 'MUSIC VIDEO',
    description: 'Another completed project'
  }
];
