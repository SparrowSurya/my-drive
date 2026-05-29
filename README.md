# Drive
A google drive clone for storing and sharing files

## Environment
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
SESSION_MAX_AGE=604800
NEXT_PUBLIC_SESSION_REFETCH_INTERVAL=3600
NEXT_PUBLIC_SESSION_REFETCH_ON_WINDOW_FOCUS=0
```
## Setup, Build & Run
```sh
npm i
npx prisma generate
npm run build
npm run start
```

## WIP
* Activity

## Partially Tested
* verify the magic numbers for mime types

## TODO
* Share
* Versions

## LATER
* Preview in grid view.
* Item selection
* More sort options on elipsis column
* File/Folder information
* Advanced search filters