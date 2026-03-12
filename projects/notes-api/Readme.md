# Notes API

Setup
1. `npm install`
2. Edit `.env` with JWT_SECRET
3. `npm run dev`

Endpoints
- POST /api/auth/register {username, email, password, role?} → token
- POST /api/auth/login {email, password} → token
- GET/POST/PUT/DELETE /api/notes → own notes (Auth header: Bearer <token>)
- GET/DELETE /api/notes/all & /api/notes/admin/:id → admin only

Test with Postman/cURL.
Deploy: Railway/Render (env vars + SQLite file).[web:38][web:43]
