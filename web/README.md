# AI Writing Detector — Web App

A stateless web UI for the AI Writing Detector. Paste or upload text, get a full
analysis report in the browser. No backend required — all analysis runs
client-side.

## Development

```bash
cd web
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build to web/dist/
npm run preview  # preview the production build locally
```

## How it works

The web app imports the shared analysis core from `../src/` via the `@` path
alias (configured in `vite.config.ts`). The entry point is
`generateReport()` from `@/report/assembler.js`, which returns a plain
JSON-serializable `Report` object.

The analysis is entirely rule-based and runs locally in the browser — no LLM
calls, no API keys, no backend.

## Deploy to Cloudflare Pages

1. Push your fork to GitHub.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) and create a new
   project connected to your GitHub repo.
3. Configure the build:
   - **Root directory:** `web`
   - **Build command:** `npm install && npm run build`
   - **Build output directory:** `dist`
4. Save and deploy. Cloudflare will auto-deploy on every push to your main
   branch.

### Alternative: GitHub Pages

If you prefer GitHub Pages, use the included GitHub Actions workflow (create
`.github/workflows/deploy-web.yml`):

```yaml
name: Deploy Web App
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - working-directory: web
        run: |
          npm install
          npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: web/dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

## API

A headless HTTP API is available at `POST /api/analyze` via Cloudflare Pages
Functions. It runs the same analysis core as the web app, server-side, and
returns the full report as JSON.

### Usage

```bash
curl -X POST https://your-domain.pages.dev/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Paste text to analyze here."}'
```

### Response

**Success (200):**

```json
{
  "report": {
    "timestamp": { "iso": "...", "local": "..." },
    "statistics": { "characterCount": 123, "wordCount": 45, ... },
    "linguistic": { "factors": [...], "overallScore": 3, ... },
    "patterns": { "categories": [...], "totalScore": 20, ... },
    "score": { "score": 57, "classification": "Possibly AI-Generated", ... },
    "contributions": [...]
  }
}
```

**Errors:**

| Status | Cause |
| --- | --- |
| 400 | Missing or empty `text` field, malformed JSON |
| 405 | Non-POST request |
| 413 | Text exceeds 100,000 characters |
| 500 | Analysis failure |

All errors return `{ "error": "..." }` with a plain-English message.

CORS is permissive (`Access-Control-Allow-Origin: *`) so the API is callable
from browser-based tools on any domain.

## Architecture

```
web/
├── package.json          # Svelte 4 + Vite 5
├── vite.config.ts        # @ alias → ../src (shared core)
├── tsconfig.json
├── wrangler.jsonc        # Cloudflare Pages config
├── index.html
├── functions/
│   └── api/
│       └── analyze.ts    # POST /api/analyze — headless JSON API
└── src/
    ├── main.ts           # Svelte mount point
    ├── app.css           # global styles + CSS variables
    ├── App.svelte        # state: input ↔ results toggle
    └── components/
        ├── TextInput.svelte    # textarea + file upload + drag-drop
        └── ReportView.svelte   # dashboard: gauge, stat strip, detail cards
```

The shared analysis core lives in `../src/` and is unchanged by the web app.
The only modification to `src/` is a barrel refactor that removes `chalk`
re-exports from `scoring/index.ts` and `report/index.ts` so the core is
browser-safe and Workers-safe.
