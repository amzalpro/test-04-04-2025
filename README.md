# SchoolSync v0.2.0 - School Management SPA

Offline-first School Management Single Page Application built with React, TypeScript, and Progressive Web App capabilities.

## 🚀 Features

### Core Functionality
- **Offline-First Architecture**: Full PWA support with service worker cache-first strategy
- **Modular Design**: Clean separation of config/api/ui/main layers
- **JSON-Based Data**: No backend dependency, data loaded from `/data/*.json` files
- **In-Memory State Management**: Fast, reactive data operations
- **Multi-Language Support**: French interface with internationalization ready

### CRUD Operations
- **Students Management**: Full CRUD with advanced filtering and search
- **Classes Management**: Organization and capacity tracking
- **Groups Management**: Flexible grouping for evaluations (class/group targeting)
- **Evaluations**: Comprehensive assessment system with weighted coefficients
- **Skills Management**: Competency-based evaluation with acquisition levels
- **Absences Tracking**: Detailed absence management with parent notifications

### Advanced Features
- **Dashboard Statistics**: Real-time counts and global averages
- **Notes Grid**: Per-student averages weighted by evaluation coefficients
- **Export/Import System**: 
  - Individual JSON collection exports
  - Bulk export as separate JSON files
  - Single ZIP export with JSZip
  - Multi-file JSON import with validation
- **PDF Generation**: Class reports and individual bulletins using jsPDF
- **PWA Capabilities**:
  - Install prompt and offline badge
  - Cache management and clearing
  - Online/offline status detection
- **Theme Support**: Light/dark mode with persistent preferences
- **Alert System**: Toast notifications for user feedback

### Future Enhancements (Planned)
- **Seating Chart Editor**: Drag & drop seat assignment with save/reset
- **Enhanced Timetable**: Interactive schedule management
- **IndexedDB Persistence**: Client-side data persistence
- **Rich PDF Reports**: Advanced bulletin generation
- **Data Visualization**: Charts and analytics
- **ZIP Compression**: Optimized export file sizes
- **Advanced Validation**: Enhanced data integrity checks

## 🏗️ Architecture

### Modular Structure
```
src/
├── config/           # Application configuration
│   └── app.ts       # Centralized config management
├── api/             # Data layer
│   ├── types.ts     # TypeScript interfaces
│   ├── dataStore.ts # In-memory data management
│   ├── exportImport.ts # Data export/import utilities
│   └── pdfGenerator.ts # PDF generation
├── ui/              # UI layer
│   ├── AlertContext.tsx    # Alert system
│   ├── AlertContainer.tsx  # Alert display
│   ├── PWAStatus.tsx      # PWA status indicator
│   └── ExportImportPanel.tsx # Data management UI
├── components/      # React components
├── pages/          # Application pages
└── context/        # React contexts
```

### Data Collections
```
public/data/
├── students.json    # Student records
├── classes.json     # Class definitions
├── groups.json      # Group management
├── evaluations.json # Assessment data
├── skills.json      # Competency framework
├── absences.json    # Absence tracking
└── timetable.json   # Schedule data
```

## 🛠️ Installation & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone [repository-url]
cd schoolsync

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### PWA Development
The application includes:
- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js`
- **Icons**: Placeholder 192x192 & 512x512 PNG icons

## 📊 Data Management

### JSON Data Structure
All data is stored in human-readable JSON format:

```json
// students.json example
[
  {
    "id": "s1",
    "name": "Emma Thompson",
    "class": "10A",
    "roll": "1001",
    "grades": {
      "mathematics": 85,
      "physics": 78
    },
    "attendance": 92
  }
]
```

### Export Formats
- **Individual Collections**: Single JSON files per collection
- **Bulk Export**: All collections as separate downloads
- **ZIP Archive**: Complete backup in compressed format
- **PDF Reports**: Class averages and individual bulletins

### Import Support
- Multi-file JSON import
- Automatic collection detection
- Data validation and error reporting
- In-memory replacement of collections

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast theme support

### Theme System
- Light/dark mode toggle
- Persistent theme preferences
- CSS custom properties for theming
- Smooth transitions between modes

## 🔧 Configuration

### App Configuration (`src/config/app.ts`)
Centralized configuration for:
- API endpoints and timeouts
- PWA settings
- Export/import formats
- PDF generation options
- UI preferences
- Academic grading scales

### Environment Variables
No environment variables required - fully self-contained application.

## 📱 PWA Features

### Installation
- Browser-based install prompt
- Standalone app experience
- Custom splash screen
- App icon and theming

### Offline Support
- Cache-first strategy for app shell
- JSON data caching
- Offline indicator
- Graceful degradation

### Performance
- Lazy loading components
- Optimized bundle splitting
- Image optimization
- Service worker caching

## 🚀 Deployment

### Static Hosting
Perfect for deployment on:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Any static file server

### Build Output
```bash
npm run build
# Generates dist/ folder with:
# - Optimized HTML, CSS, JS
# - Service worker
# - Manifest and icons
# - Data files
```

## 🤝 Contributing

### Development Guidelines
- Use TypeScript for type safety
- Follow existing code patterns
- Maintain modular architecture
- Add JSDoc comments for complex functions
- Update README for new features

### Testing
- Manual testing workflow provided
- Unit tests can be added with Vitest
- E2E testing with Playwright (future)

## 📄 License

MIT License - See LICENSE file for details.

## 🔗 Dependencies

### Core
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling

### Features
- **Lucide React**: Icon library
- **JSZip**: ZIP file generation
- **FileSaver**: File download handling
- **jsPDF**: PDF generation
- **React Router**: Client-side routing

## 📞 Support

For issues, feature requests, or questions:
1. Check existing documentation
2. Review data structure examples
3. Test in incognito mode for PWA features
4. Check browser console for errors

---

**Version**: 0.2.0  
**Last Updated**: April 2025  
**Compatibility**: Modern browsers with ES2020+ support
