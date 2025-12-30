# Church History | Doctrine Trace

A modern, scholarly web application for tracing doctrinal claims through 2,000 years of church history.

## Features

- **Claim-First Navigation**: Search and explore atomic doctrinal claims
- **Historical Trace**: See how claims developed from Scripture → Fathers → Medieval → Reformation
- **Multi-Lens Interpretation**: View Catholic, Orthodox, Lutheran, Reformed, and other perspectives
- **Consensus Analysis**: AI-powered summary of agreement vs. contested interpretations
- **Citation System**: Full Chicago-style citations with one-click copy (Chicago & BibTeX)
- **Premium UX**: Subtle animations, citation tooltips, reading progress, keyboard shortcuts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data**: Local JSON files (no database required)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── claim/[id]/        # Individual claim trace view
│   ├── doctrine/[slug]/   # Doctrine cluster page
│   ├── explore/           # Explore hub
│   └── timeline/          # Historical timeline (secondary)
├── components/
│   └── domain/            # Feature components
├── content/               # JSON data files
│   ├── claims.json
│   ├── nodes.json
│   ├── edges.json
│   ├── sources.json
│   └── interpretations.json
└── lib/
    ├── data.ts            # Data access utilities
    ├── types.ts           # TypeScript interfaces
    └── motion.ts          # Animation configuration
```

## Content Management

All content is in `/src/content/` as JSON files. No coding required to add new claims, sources, or interpretations.

### Adding a New Claim

1. Add entry to `claims.json`:
```json
{
  "id": "CLM_NEW_ID",
  "cluster": "Doctrine Name",
  "short_label": "Brief claim title",
  "full_statement": "Complete doctrinal statement...",
  "definition_variants": ["Alt definition 1", "Alt definition 2"]
}
```

2. Add supporting nodes to `nodes.json`
3. Link with edges in `edges.json`
4. Add interpretations to `interpretations.json`

See existing data for examples.

## Keyboard Shortcuts

- `?` - Show shortcuts overlay
- `ESC` - Close drawer/modal
- `1-6` - Switch lenses (on claim pages)
- `/` - Focus search

## License

MIT

## Contributing

This is a personal research tool. For questions or suggestions, open an issue.
