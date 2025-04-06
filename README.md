# ArtReader - Reader for PDF/DJVU

![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A modern cross-platform desktop application for reading PDF and DJVU documents, built with Electron, Vue 3, and TypeScript.

## Features
- 📄 PDF and DJVU document viewing
- 🔍 Text search functionality
- 🔎 Zoom controls
- 📑 Bookmark management
- ✏️ Annotation support
- 🎨 Customizable reading themes

## Installation

### Prerequisites

- Node.js v16+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/pdf-reader.git
cd pdf-reader

# Install dependencies
npm install
# or
yarn install

# Build renderer process (development)
npm run build:render

# Start dev server with hot-reload
npm run watch

# Build electron main process (development)
npm run build:electron

# Build both processes and launch the app
npm run launch

# Build production-ready application (TODO)
npm run build:release

# Run tests (TODO)
npm run test
```
## Technical Stack

### Core Technologies

| Technology | Purpose                                 |
| ---------- | --------------------------------------- |
| Electron   | Cross-platform desktop framework        |
| Vue 3      | Frontend framework with Composition API |
| TypeScript | Type checking and modern JS features    |
| Webpack 5  | Module bundling and asset pipeline      |
## License

[MIT](https://mit-license.org/)
