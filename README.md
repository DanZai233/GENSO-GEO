# GENSO-GEO / 幻想霊脈帖

GENSO-GEO is an open-source Touhou-inspired geo-fantasy naming tool. It turns real-world map locations or character descriptions into multilingual character names, titles, inspirations, and spellcard-style records.

中文来说，它像一份临时的《幻想乡地缘名帖》：点一下现实地图的灵脉，或者写下一段角色设定，让网站生成中文、英文、日文和罗马音的名字。它不是替创作者做最终决定，而是把“第一缕灵感”整理成可以继续打磨的设定卡。

Live site: [genso-geo.danzaii.cn](https://genso-geo.danzaii.cn)  
GitHub: [github.com/DanZai233/GENSO-GEO](https://github.com/DanZai233/GENSO-GEO)  
Blog: [blog.danzaii.cn](https://blog.danzaii.cn/)  
Works: [works.danzaii.cn](https://works.danzaii.cn/)

## Design Intent

- Give writers, TRPG players, fan creators, and naming enjoyers a playful first draft for place-bound characters.
- Blend real geography with a shrine-boundary fantasy mood without exposing model/provider details to end users.
- Keep the generated record useful across languages: Chinese, English, Japanese, and Romaji.
- Make the app usable on desktop, tablet, and mobile, with a beginner guide on first visit.

## New User Flow

1. Choose a language on first entry.
2. Read the Hakurei Shrine-style guide explaining purpose, usage, and links.
3. Use Map Leylines to click or search a real-world location.
4. Pick a style preset, or switch to Narrative Sync and write a character description.
5. Save good results to the local Chronicles collection.
6. Optionally hang a public shrine ema note with the location, generated name, message, optional email, time, and visitor country.
7. Explore nearby ema notes within a configurable 10-300km radius, or browse the public Ema Notice Plaza.
8. Export a spellcard-style PNG when you want a portable character card.

## Features

- Multi-device React/Vite frontend for desktop, tablet, and mobile.
- First-visit language selection and Touhou-style onboarding guide.
- Map mode with MapLibre, OpenStreetMap tiles, Nominatim search, and reverse geocoding.
- Narrative mode that combines character descriptions with regional geography.
- Frontend request lock and “少女祈祷中～” loading transition to prevent repeat submissions.
- Local browser collection with PNG card export.
- Public Touhou-style Ema Plaza backed by MongoDB, with nearby geospatial note discovery.
- Backend provider switcher for Gemini, Volcengine Ark, and other OpenAI-compatible providers.
- Vercel-ready static frontend plus serverless `/api/*` functions.
- User-facing UI does not reveal which model or provider generated the result.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Provider Configuration

The frontend always calls:

- `POST /api/generate-name`
- `POST /api/generate-description-name`

The backend selects the model provider through environment variables.

### Gemini

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash
```

### Volcengine Ark / 火山引擎方舟

```bash
AI_PROVIDER=volcengine
VOLCENGINE_API_KEY=...
VOLCENGINE_MODEL=...
VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

`VOLCENGINE_MODEL` should be the Ark endpoint ID or model endpoint name from your 火山引擎方舟 console.

### Other OpenAI-Compatible Providers

```bash
AI_PROVIDER=openai-compatible
OPENAI_COMPATIBLE_API_KEY=...
OPENAI_COMPATIBLE_BASE_URL=https://provider.example.com/v1
OPENAI_COMPATIBLE_MODEL=provider-model-name
```

Optional generation controls:

```bash
AI_TEMPERATURE=0.85
AI_MAX_TOKENS=2000
AI_REQUEST_RETRIES=3
AI_CONNECT_TIMEOUT_MS=25000
AI_HEADERS_TIMEOUT_MS=90000
AI_BODY_TIMEOUT_MS=240000
AI_RETRY_BASE_DELAY_MS=900
```

## Vercel Deployment

This repo is configured for Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- API functions: `api/*.ts`
- Function max duration: `300s`
- Function region: `hkg1`, closer to 火山引擎方舟's Beijing endpoint than Vercel's default `iad1`

Set the same environment variables in Vercel Project Settings before deploying. For 火山引擎, you will need:

- `AI_PROVIDER=volcengine`
- `VOLCENGINE_API_KEY`
- `VOLCENGINE_MODEL`
- Optional: `VOLCENGINE_BASE_URL`

For the public Ema Plaza, configure MongoDB:

- `MONGODB_URI` — compatible with the PixelBead MongoDB Atlas variable
- Optional: `GENSOGEO_MONGODB_DB=pixelbead`
- Optional: `GENSOGEO_EMA_COLLECTION=genso_ema_notes`

The Ema Plaza stores public user-submitted messages, generated name metadata, coordinates, optional public email, submission time, and Vercel's visitor country header. It does not store the raw IP address.

Deploy:

```bash
npx vercel deploy --prod --yes
```

## Scripts

```bash
npm run dev          # Local Express + Vite middleware server
npm run build        # Vercel/static frontend build
npm run build:server # Optional standalone Express production bundle
npm run lint         # TypeScript check
```

## Related

- Project article: [blog.danzaii.cn](https://blog.danzaii.cn/)
- Works index: [works.danzaii.cn](https://works.danzaii.cn/)
- Author GitHub: [github.com/DanZai233](https://github.com/DanZai233)
