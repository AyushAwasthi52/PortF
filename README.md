
# Ayush Portfolio

An interactive personal portfolio website built using Next.js, React, TypeScript, CSS Modules, and Framer Motion.

The project experiments with a cinematic, game-inspired interface featuring keyboard navigation, animated transitions, interactive project layouts, and custom visual components.

## Features

- Animated landing page
- Keyboard-controlled navigation
- Animated menu transitions
- Interactive project showcase
- Coding profile section
- Custom map-inspired interface components
- Audio interaction hooks
- CSS Modules for component styling
- Responsive UI components

## Technology Stack

- Next.js
- React
- TypeScript
- Framer Motion
- CSS Modules

## Project Structure

```text
PortF/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── projects/
│   │   └── profiles/
│   │
│   ├── components/
│   │   ├── Map/
│   │   └── AttacheCase.tsx
│   │
│   ├── data/
│   │   ├── projects.ts
│   │   └── profiles.ts
│   │
│   └── hooks/
│       └── useAudio.ts
│
├── public/
├── package.json
└── README.md
```

## Getting Started

Requirements:
- Node.js
- npm

Clone the repository:

```bash
git clone https://github.com/AyushAwasthi52/PortF.git
cd PortF
```

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Development Notes

The project uses an application-level navigation system with animated transitions and keyboard interaction.

Project and profile content is maintained through local TypeScript data modules.

The portfolio is under development. Some menu destinations and project entries still require completion and replacement with verified links.

## Future Improvements

- Complete all navigation destinations
- Populate project cards with real repositories
- Add live project demonstrations
- Improve accessibility
- Optimize mobile navigation
- Add keyboard focus indicators
- Improve performance and animation handling

## License

See the repository license information.
