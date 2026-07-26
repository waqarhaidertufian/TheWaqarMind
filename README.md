# TheWaqarMind — Full-Stack Creative Studio & Digital PDF Library

A production-grade, highly performant web application featuring a cinematic showcase and an online **Digital PDF Library** powered by **Supabase**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Motion**.

---

## 🚀 Key Features

- **Exact Aesthetic Preservation**: Retains 100% of the original design, layout, typography, colors (`#000000` & `#E1E0CC`), animations, and luxury feel.
- **Hero Library CTA**: A sleek, glass-morphic **"Library"** button seamlessly integrated into the navigation and Hero CTA section.
- **Supabase Backend**: Fully integrated PostgreSQL database table (`books`) and Storage bucket (`books`) with Row-Level Security (RLS).
- **Interactive Digital Library**:
  - Real-time keyword search across titles, authors, and descriptions.
  - Category filters (*Technology & AI*, *Mindset & Growth*, *Design & Arts*, *Leadership*, *Philosophy*).
  - Responsive glassmorphic book card grid with hover scaling effects.
- **In-Browser PDF Reader**:
  - Embedded browser reading experience with zero forced downloads.
  - Page navigation controls (Previous / Next).
  - Zoom controls (50% to 200%).
  - Fullscreen toggle mode.
  - Keyboard navigation (Arrow keys for page navigation, Escape to exit).
- **Protected Admin Portal**:
  - Passcode protection (`admin123`).
  - Upload PDF files and book cover images directly to Supabase Storage.
  - Edit or delete publications with real-time database synchronization.
- **Zero-Config Fallback**: Automatic local storage fallback when Supabase keys are not set, ensuring zero broken states in development or testing.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons
- **Backend & Storage**: Supabase (PostgreSQL & Storage Objects)
- **Deployment**: Vercel / Cloud Run / GitHub Actions

---

## 📂 Project Structure

```
├── supabase/
│   └── schema.sql         # SQL schema script (Tables, Buckets, RLS Policies)
├── src/
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── LibraryModal.tsx   # Digital Library Page View
│   │   ├── PdfReaderModal.tsx # In-browser PDF Reader
│   │   ├── AdminModal.tsx     # Admin Upload/Edit/Delete Portal
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts        # Supabase Client Initialization
│   ├── services/
│   │   └── bookService.ts     # Data service layer with local fallback
│   ├── types.ts               # Shared TypeScript Types & Book Interface
│   ├── App.tsx
│   └── main.tsx
├── .env.example
└── README.md
```

---

## ⚙️ Step 1: Setting Up Supabase Backend

1. Go to [Supabase](https://supabase.com) and create a new project.
2. In your Supabase Dashboard, open the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql` and run it in the SQL Editor. This will:
   - Create the `books` table.
   - Enable Row Level Security (RLS) policies allowing public reads and admin writes.
   - Create the public `books` storage bucket for PDF files and cover images.
4. Copy your project credentials from **Project Settings -> API**:
   - `Project URL`
   - `anon / public key`

---

## 💻 Step 2: Local Environment Setup

1. Clone or navigate to the repository directory.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your Supabase URL and Anon Key in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Install dependencies and start development server:
   ```bash
   npm install
   npm run dev
   ```

---

## 🐙 Step 3: Push to GitHub

1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production full-stack application with Supabase digital library"
   ```
2. Create a repository on GitHub named `thewaqarmind`.
3. Add remote origin and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/thewaqarmind.git
   git push -u origin main
   ```

---

## ⚡ Step 4: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New -> Project**.
2. Select your GitHub repository (`thewaqarmind`).
3. In **Environment Variables**, add:
   - Name: `VITE_SUPABASE_URL` | Value: `https://your-project-id.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY` | Value: `your-supabase-anon-key`
4. Click **Deploy**. Vercel will automatically build and publish your full-stack app.

---

## 🔒 Admin Credentials

- **Admin Passcode**: `admin123`
- Access via the **Admin Management** button inside the Digital Library page view.
