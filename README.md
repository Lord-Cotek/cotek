# COTEK Portal (Root: cotek.app)

A simple, colorful launchpad that links to:
- https://bms.cotek.app
- https://hr.cotek.app
- https://fin.cotek.app

## 1) Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## 2) Create a GitHub repo and push
```bash
git init
git add .
git commit -m "Initial COTEK portal"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 3) Deploy on Vercel
1. Import the repo into Vercel (New Project -> Import Git Repository)
2. Framework preset: Next.js (auto-detected)
3. Build command: `next build` (default)
4. Output: default

## 4) Point `cotek.app` root domain to this Vercel project
In Vercel:
- Project -> Settings -> Domains -> Add `cotek.app`
Vercel will tell you what DNS record to set at your domain provider:
- Usually: an **A record** for apex OR **ALIAS/ANAME** (depending on provider)
- And a verification TXT record if needed

Keep your existing subdomains as-is:
- bms.cotek.app
- hr.cotek.app
- fin.cotek.app

## 5) Change email links (optional)
Edit `app/page.tsx` and update:
- it@cotek.app
- support@cotek.app

---
Built as a lightweight static UI (no backend, no auth).
