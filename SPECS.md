# DEFRAG PROJECT SPECS
# MISSION
Defrag is a Structural Analysis Platform for human dynamics, not a therapy app.
Style: "Brutalist" CLI (Command Line Interface).
Colors: Pure Black (#050505), Slate, White. No gradients, no shadows.

# ARCHITECTURE
1. Frontend: Next.js 14 (App Router).
   - Component: "CommandStream.tsx" (Single stream chat interface).
   - State: Vercel AI SDK (useChat) for streaming responses.
2. Backend: Python Microservice (Swiss Ephemeris).
   - Logic: Located in `/core_logic`.
   - API: `api.defrag.app` routes to this service.
3. Database: Supabase (PostgreSQL).

# "NO METAPHOR" RULE
- Forbidden: "Healing", "Vibes", "Soul", "Energy".
- Mandatory: "Mechanics", "Friction", "Latency", "Protocols".

# FOLDER STRUCTURE
/core_logic   (Python/Astrology calculations)
/components   (UI Elements)
/app          (Next.js Routes)
/lib          (Utils & API Clients)
