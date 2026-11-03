export interface ProfileStatistic {
  label: string;
  value: string | number;
}

export type ProfileCategory = 'Competitive Programming' | 'Development' | 'Professional' | 'Problem Solving';

export interface ProfileData {
  id: string;
  name: string;
  username: string;
  url: string;
  coordinates: { x: number; y: number }; // Absolute units (e.g. 0-8000 x 0-4800)
  description: string;
  category: ProfileCategory;
  statistics: ProfileStatistic[];
  icon: string; // Identifier for vector icon
  accentColor?: string;
  sector?: string;
}

export const profilesData: ProfileData[] = [
  {
    id: 'github',
    name: 'GitHub',
    username: '@ayushawasthi',
    url: 'https://github.com/ayushawasthi',
    coordinates: { x: 3300, y: 2200 },
    description: 'Central stronghold of open-source projects, system architectures, and core repositories.',
    category: 'Development',
    icon: 'github',
    accentColor: '#58a6ff',
    sector: 'SECTOR 01 // DEV CITADEL',
    statistics: [
      { label: 'Repositories', value: 34 },
      { label: 'Followers', value: 12 },
      { label: 'Stars Earned', value: 104 }
    ]
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    username: 'ayush_cf',
    url: 'https://codeforces.com/profile/ayush_cf',
    coordinates: { x: 4200, y: 2000 },
    description: 'Contest combat grounds for rapid algorithm execution and timed competitive rounds.',
    category: 'Competitive Programming',
    icon: 'codeforces',
    accentColor: '#f39c12',
    sector: 'SECTOR 02 // ALGORITHM VALLEY',
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
    coordinates: { x: 4500, y: 2600 },
    description: 'Deep training grounds for data structures, dynamic programming, and algorithmic optimization.',
    category: 'Competitive Programming',
    icon: 'leetcode',
    accentColor: '#ffa116',
    sector: 'SECTOR 02 // ALGORITHM VALLEY',
    statistics: [
      { label: 'Solved Total', value: 412 },
      { label: 'Easy / Med / Hard', value: '150 / 220 / 42' },
      { label: 'Ranking', value: 'Top 12%' }
    ]
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    username: 'ayush_chef',
    url: 'https://www.codechef.com/users/ayush_chef',
    coordinates: { x: 4900, y: 2200 },
    description: 'Long challenge campaigns and division contests exploring complex mathematical bounds.',
    category: 'Competitive Programming',
    icon: 'codechef',
    accentColor: '#b4845c',
    sector: 'SECTOR 02 // ALGORITHM VALLEY',
    statistics: [
      { label: 'Rating', value: 1650 },
      { label: 'Star Tier', value: '3★' },
      { label: 'Global Rank', value: '14,200' }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    username: 'in/ayushawasthi',
    url: 'https://linkedin.com/in/ayushawasthi',
    coordinates: { x: 3200, y: 2800 },
    description: 'Professional intelligence network, leadership communications, and career dossier.',
    category: 'Professional',
    icon: 'linkedin',
    accentColor: '#0a66c2',
    sector: 'SECTOR 03 // OUTPOST COMMAND',
    statistics: [
      { label: 'Connections', value: '500+' },
      { label: 'Experience', value: '2+ Years' },
      { label: 'Endorsements', value: '40+' }
    ]
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    username: 'ayush_hr',
    url: 'https://www.hackerrank.com/ayush_hr',
    coordinates: { x: 3800, y: 2900 },
    description: 'Verified skill domain credentials across Core Problem Solving and Systems Programming.',
    category: 'Problem Solving',
    icon: 'hackerrank',
    accentColor: '#00ea64',
    sector: 'SECTOR 03 // OUTPOST COMMAND',
    statistics: [
      { label: 'Problem Solving', value: '6★ Gold' },
      { label: 'C++ Domain', value: '5★ Gold' },
      { label: 'Python Domain', value: '5★ Gold' }
    ]
  }
];
