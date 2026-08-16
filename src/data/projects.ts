export type ProjectCategory = 'Web' | 'System' | 'Mobile' | 'AI' | 'Other';

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: ProjectCategory;
  year: number;
  gridWidth: number;
  gridHeight: number;
  x: number;
  y: number;
  rotation?: number; // 0, 90, 180, 270
  icon?: string;
}

export const projectsData: ProjectData[] = [
  {
    id: 'proj-1',
    title: 'Nexus Engine',
    shortDescription: 'Custom 2D Game Engine in C++',
    detailedDescription: 'A custom 2D game engine built from scratch using C++ and Vulkan. Features a custom ECS, rigid body physics, and a fully functional editor mode.',
    technologies: ['C++', 'Vulkan', 'GLM', 'ImGui'],
    githubUrl: 'https://github.com/example/nexus',
    category: 'System',
    year: 2025,
    gridWidth: 2,
    gridHeight: 2,
    x: 0,
    y: 0,
  },
  {
    id: 'proj-2',
    title: 'Neural Flow',
    shortDescription: 'Visual Node-based ML Builder',
    detailedDescription: 'A web-based interactive tool that allows users to build, visualize, and export neural network architectures by connecting nodes.',
    technologies: ['React', 'TypeScript', 'Zustand', 'WebGL'],
    githubUrl: 'https://github.com/example/neural-flow',
    liveUrl: 'https://neuralflow.example.com',
    category: 'Web',
    year: 2024,
    gridWidth: 2,
    gridHeight: 1,
    x: 2,
    y: 0,
  },
  {
    id: 'proj-3',
    title: 'Vanguard OS',
    shortDescription: 'Hobbyist x86 Operating System',
    detailedDescription: 'A small toy operating system to learn about kernel development, featuring a basic shell, memory management, and file system.',
    technologies: ['C', 'Assembly', 'QEMU'],
    githubUrl: 'https://github.com/example/vanguard-os',
    category: 'System',
    year: 2023,
    gridWidth: 1,
    gridHeight: 2,
    x: 4,
    y: 0,
  },
  {
    id: 'proj-4',
    title: 'Echo Chat',
    shortDescription: 'E2E Encrypted CLI Messenger',
    detailedDescription: 'A secure peer-to-terminal messaging application using libp2p and AES-GCM encryption.',
    technologies: ['Rust', 'libp2p', 'Tokio'],
    githubUrl: 'https://github.com/example/echo',
    category: 'Other',
    year: 2024,
    gridWidth: 1,
    gridHeight: 1,
    x: 2,
    y: 1,
  },
  {
    id: 'proj-5',
    title: 'Cyber Deck',
    shortDescription: 'Cyberpunk Portfolio',
    detailedDescription: 'My previous portfolio website styled like a retro cyberpunk terminal.',
    technologies: ['Vue', 'CSS', 'Vite'],
    githubUrl: 'https://github.com/example/cyber-deck',
    category: 'Web',
    year: 2022,
    gridWidth: 1,
    gridHeight: 1,
    x: 3,
    y: 1,
  }
];
