export interface ProfileStatistic {
  label: string;
  value: string | number;
}

export type ProfileCategory = 'Competitive Programming' | 'Development' | 'Professional' | 'Other';

export interface ProfileData {
  id: string;
  name: string;
  username: string;
  url: string;
  coordinates: { x: number; y: number }; // Absolute units (e.g. 0-2000) for a fixed map size
  description: string;
  category: ProfileCategory;
  statistics: ProfileStatistic[];
  icon: string; // We can use emoji, SVG names, or simple letters for now
}

export const profilesData: ProfileData[] = [
  {
    id: 'github',
    name: 'GitHub',
    username: '@ayushawasthi',
    url: 'https://github.com/ayushawasthi',
    coordinates: { x: 3500, y: 2100 },
    description: 'Open source contributions and personal projects.',
    category: 'Development',
    icon: 'GH',
    statistics: [
      { label: 'Repositories', value: 34 },
      { label: 'Followers', value: 12 },
      { label: 'Stars', value: 104 }
    ]
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    username: 'ayush_cf',
    url: 'https://codeforces.com/profile/ayush_cf',
    coordinates: { x: 4200, y: 2400 },
    description: 'Competitive programming and algorithm challenges.',
    category: 'Competitive Programming',
    icon: 'CF',
    statistics: [
      { label: 'Rating', value: 1208 },
      { label: 'Max Rating', value: 1350 },
      { label: 'Problems Solved', value: 245 }
    ]
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    username: 'ayush_lc',
    url: 'https://leetcode.com/ayush_lc',
    coordinates: { x: 4400, y: 2000 },
    description: 'Data structures and technical interview preparation.',
    category: 'Competitive Programming',
    icon: 'LC',
    statistics: [
      { label: 'Problems Solved', value: 412 },
      { label: 'Easy', value: 150 },
      { label: 'Medium', value: 220 },
      { label: 'Hard', value: 42 }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    username: 'in/ayushawasthi',
    url: 'https://linkedin.com/in/ayushawasthi',
    coordinates: { x: 3300, y: 2600 },
    description: 'Professional experience and connections.',
    category: 'Professional',
    icon: 'IN',
    statistics: [
      { label: 'Connections', value: '500+' },
      { label: 'Experience', value: '2 Years' }
    ]
  }
];
