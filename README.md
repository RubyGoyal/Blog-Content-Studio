`RubyGoyal/Blog-Content-Studio`

**Updated GitHub About Description** *(fixes `"gutes posts"` typo)*:
> Multi-channel content creation and blog generation platform for Embee Software website blogs, LinkedIn posts, guest posts, and third-party publications.

**New `README.md`**:
```markdown
# Embee Software Blog & Content Studio

Multi-channel B2B content creation platform for generating, structuring, and adapting Embee Software articles across website blogs, LinkedIn posts, guest posts, and third-party publications.

## Problem & Product Approach

Adapting a single technical topic across owned blogs, guest publications, and social channels usually requires rewriting drafts manually for each channel's length, tone, and SEO constraints. This workspace standardizes structured inputs and channel-specific generation in one Express + React application.

## Key Capabilities

- **Multi-Format Content Workflows**: Supports website blogs, guest posts, LinkedIn posts, and third-party technical articles.
- **Server-Side Gemini Integration**: Keeps `GEMINI_API_KEY` on the Express backend (`server.ts`) rather than exposing API keys in the browser.
- **Structured Brand Context**: Aligns output with Embee Software's enterprise B2B positioning across Microsoft, SAP, and Cloud practices.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons
- **Backend**: Express (`server.ts`), `@google/genai`

## Run Locally

1. Copy `.env.example` to `.env` and add `GEMINI_API_KEY`.
2. Install and start the full-stack server:

```bash
npm install
npm run dev
