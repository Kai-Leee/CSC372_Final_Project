# Smart Portfolio & Task Dashboard

Full-stack final project MVP using:
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL (Neon via `.env`)
- External API: Finnhub (quotes + market news)
- Auth: Basic register/login/logout (session token)

## Video Recording

- Demo video link: [Watch here](https://uncg-my.sharepoint.com/:v:/g/personal/g_lee8_uncg_edu/IQDtg5zuAbJiR7JbfZJKBPQtAVin9XWuk9d5Z9_i5Kt7yDU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=jnqGYY)

## Project Structure

```
CSC372_Final_Project/
  client/                       # React frontend
  client/src/components/        # UI components
  client/src/app/services/      # client API services
  client/src/model/             # client-side model helpers
  server/                       # Express API
  server/src/routes/            # route handlers (thin)
  server/src/controllers/       # request logic
  server/src/model/             # DB query layer
  server/src/db/                # DB connection
  server/sql/schema.sql         # PostgreSQL schema
  
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Tasks (requires Bearer token)
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### External API integration
- `GET /api/market/watchlist` (Finnhub quote API)
- `GET /api/market/news` (Finnhub news API)


