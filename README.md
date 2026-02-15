# DEFRAG: The Operating System for Human Design

## Single Source of Truth (SSOT)
This project is governed by the [DEFRAG Universal Charter](./DEFRAG_SSOT_Master.md) and the Technical Addendum. All philosophy, architecture, and engineering standards are defined there.

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase, Stripe, and Modal.com credentials.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open the dashboard:**
   [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Deployment
- **Frontend:** Deploy to Vercel. Set all environment variables in the Vercel dashboard.
- **Backend (Python):** Deploy FastAPI service to Railway, Render, or Modal.com. Ensure Swiss Ephemeris binaries are available.
- **Database:** Supabase (PostgreSQL). Apply schema from `/supabase/migrations`.

## Documentation
- [DEFRAG Universal Charter](./DEFRAG_SSOT_Master.md)
- [Technical Addendum](./DEFRAG_Technical_Addendum.md)
- [IDE Agent Handover](./IDE_Agent_Handover.md)

## Onboarding
- New developers: Read the SSOT and Addendum before coding.
- Users: Log in, input your birth data, and explore your dashboard.

## Support & Feedback
- For issues, open a GitHub issue or email support@defrag.app
- Feedback: Use the feedback widget in the dashboard footer.

## Legal
- See the Charter for privacy, liability, and terms.

---
This is a category-defining platform. Build and operate with precision.
