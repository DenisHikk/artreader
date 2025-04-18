# ArtReader - Reader for PDF/DJVU

![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=000000)
![Quasar](https://img.shields.io/badge/Quasar-1976D2?style=for-the-badge&logo=quasar&logoColor=white)
![PDF.js](https://img.shields.io/badge/PDF.js-FF0000?style=for-the-badge&logo=pdf&logoColor=white)

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

- Node.js v21+
- npm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/pdf-reader.git
cd pdf-reader

# Install dependencies
npm install

# Build renderer process (development)
npm run build:render

# Start dev server with hot-reload
npm run watch

# Build electron main process (development)
npm run build:electron

# Build both processes and launch the app
npm run build:launch

# Launch the app
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
| Pinia      | State management solution for Vue 3 applications |
| Quasar     | Vue-based UI component library and development framework |
| PDFjs      | PDF rendering and parsing in web environments (Mozilla’s open-source library) |

## Documentation
- **Vue3** - [Documentation](https://vuejs.org/guide/quick-start.html)
- **Electron** - [Documentation](https://www.electronjs.org/ru/docs/latest/)
- **TypeScript** - [Documentation](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- **Pinia** - [Documentation](https://pinia.vuejs.org/core-concepts/)
- **Quasar** - [Documentation](https://quasar.dev/start/quick-start)


## License
[MIT](https://mit-license.org/)
