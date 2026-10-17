> **Research platform setup, usage and tests: see [MILESTONES.md](./MILESTONES.md).**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

Set `BETTER_AUTH_SECRET` (at least 32 characters) and `BETTER_AUTH_URL` in `.env.local`. Set `DATABASE_URL` for Prisma CLI and `DIRECT_DATABASE_URL` to a standard PostgreSQL connection URL for the runtime adapter in ignored `.env` files. Generate the auth secret with high-entropy random data, for example:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Run `npx prisma db push --config prisma7.config.ts` and `npx prisma generate --config prisma7.config.ts`, then start the app with `npm run dev`. Better Auth stores users and sessions in PostgreSQL through Prisma. Sessions use an HttpOnly cookie with a 30-minute sliding expiry; passwords use bcrypt cost 12. Five failed sign-in attempts for an email within 15 minutes lock that email for 15 minutes.

The API endpoints are `POST /api/auth/register` and `POST /api/auth/login`; Better Auth handles session lookup and logout under `/api/auth/*`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
