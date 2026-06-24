# Restaurant POS — Cafe Rubab

Full-stack restaurant point-of-sale and online ordering system with a staff admin panel, customer-facing menu site, and real-time order updates.

## Project structure

| Folder | Purpose |
|--------|---------|
| `server/` | Express API, MongoDB, Socket.io, image uploads |
| `client/` | Admin dashboard — POS, menu management, orders, analytics |
| `client-customer/` | Customer site — browse menu, cart, checkout, order tracking |

## Features

### Admin (`client`)
- Secure login with JWT
- Dashboard with sales analytics
- Menu & category management (with image upload)
- In-store POS system
- Payments & orders management
- Real-time order notifications (Socket.io)
- Change password

### Customer (`client-customer`)
- Home page with today's offers
- Browse menu by category
- Product customization
- Shopping cart & checkout
- Order history by phone number

### Backend (`server`)
- REST API for auth, products, categories, orders, payments, analytics
- MongoDB Atlas database
- Real-time events via Socket.io
- Local image storage in `uploads/`

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express 5, Mongoose, Socket.io, Multer, JWT
- **Database:** MongoDB

## Getting started (local)

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
```

Start the API:

```bash
npm run dev
```

Server runs at `http://localhost:5000`

Optional — seed sample menu data:

```bash
npm run seed:menu
```

### 2. Admin app

```bash
cd client
npm install
npm run dev
```

### 3. Customer app

```bash
cd client-customer
npm install
npm run dev
```

> Both frontends expect the API at `http://localhost:5000` by default.

## Environment variables

| App | Variable | Description |
|-----|----------|-------------|
| `server` | `MONGO_URI` | MongoDB connection string (required) |

Never commit `.env` files. Use `server/.env.example` as a template.

## Deployment (Render)

Deploy in this order:

1. **Backend** — Web Service, root: `server`, start: `npm start`
2. **Admin** — Static Site, root: `client`, build: `npm run build`, publish: `dist`
3. **Customer** — Static Site, root: `client-customer`, build: `npm run build`, publish: `dist`

Set `MONGO_URI` in the Render dashboard for the server. Allow `0.0.0.0/0` in MongoDB Atlas Network Access.

**Note:** Uploaded images are stored on the server disk. On Render free tier, files in `uploads/` may be lost on redeploy — re-upload menu images after server redeploys if needed.

## Scripts

### Server
| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon |
| `npm run seed:menu` | Seed menu data |
| `npm run seed:menu:clear` | Clear and re-seed menu |

### Client / Client-customer
| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## License

ISC
