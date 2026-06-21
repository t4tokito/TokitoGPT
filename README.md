# TokitoGPT

A Muichiro Tokito-themed AI chatbot with a retro terminal aesthetic. Built with React, Vite, and Tailwind CSS.

t4tokito — tokito-dev.netlify.app

## Features

- Terminal-style chat UI with scanline overlay and blinking caret
- Animated mist/aurora background with floating particles
- Pixel-art image rendering via canvas downscaling
- Chat history persistence across sessions (localStorage)
- Quick prompt chips for conversation starters
- Responsive design (mobile + desktop)
- Error handling with themed fallback messages

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Framework   | React 19                       |
| Build Tool  | Vite 8                         |
| Styling     | Tailwind CSS 4                 |
| Language    | JavaScript (JSX)               |
| Fonts       | Pixelify Sans, Lilita One, Boldonse, Onest |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
chatbot/
├── public/
│   ├── favicon.svg          # Vite lightning bolt favicon
│   └── icons.svg            # SVG sprite (social icons)
├── src/
│   ├── App.jsx              # Main chat component + PixelImage renderer
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind import, animations, theme variables
│   ├── assets/              # Static assets (hero.png, react.svg, vite.svg)
│   └── components/          # (empty — single-file component)
├── index.html               # HTML shell with Google Fonts preconnects
├── vite.config.js           # Vite + React + Tailwind plugins
├── eslint.config.js         # ESLint flat config (React hooks + refresh)
└── package.json
```

## API

The chatbot sends messages to a remote backend:

```
POST https://chatbot-backend-2-crcn.onrender.com/chat
Body: { "message": "text", "history": [{ "role": "user"|"assistant", "content": "..." }] }
Response: { "reply": "..." }
```

## Customization

- **Quick prompts**: Edit the `QUICK_MESSAGES` array in `src/App.jsx`
- **Theme colors**: Modify CSS variables in `src/index.css` under `:root`
- **Pixel resolution**: Adjust the `pixelSize` prop on `<PixelImage />`
- **Fonts**: Update the Google Fonts links in `index.html`

## License

MIT
