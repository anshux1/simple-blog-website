# Simple Blog App

A full-stack blog application where users can view all posts, create their own posts, update their posts, log in, and create an account. The backend is built with TypeScript, Hono (a web framework for Cloudflare Workers), Prisma, Postgres, and Zod for validation. JWT is used for authentication, and the frontend is developed with React.

## Features

- View all blog posts.
- Create, update, and delete your own posts.
- User authentication (signup and login) with JWT.
- Input validation with Zod.
- Frontend built with React.
- Backend powered by Cloudflare Workers using Hono.

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Hono (Cloudflare Workers), TypeScript, JWT for authentication
- **Database**: Postgres, Prisma ORM
- **Validation**: Zod
- **Deployment**: Cloudflare Workers
- **Package Management**: Custom npm package

### Prerequisites

- Node.js v16+ and npm
- PostgreSQL
- Cloudflare Account (for deploying Workers)
