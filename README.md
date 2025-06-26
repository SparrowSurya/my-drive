# Drive
A google drive clone for storing and sharing files

## Files
* `.env`
```env
DB_URL="file:./db.sqlite3"
```

* `.env.local`
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="nextauth-secret"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"
```
## Setup, Build & Run
```sh
npm i
npx prisma generate
npm build
npm run start
```
