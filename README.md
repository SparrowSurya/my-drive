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
SESSION_MAX_AGE=604800
NEXT_PUBLIC_SESSION_REFETCH_INTERVAL=3600
NEXT_PUBLIC_SESSION_REFETCH_ON_WINDOW_FOCUS=0
```
## Setup, Build & Run
```sh
npm i
npx prisma generate
npm build
npm run start
```


## Progress

0. Misc
* 404 page (common for all)
* Database (local)
* Home page

1. Authentication
* Signin
* Login
* Oauth (google)
* Logout
* middleware (protected routes)

2. Drive
* basic pages (home, shared-with-me, my-drive, recent, starred, trash, storage)
* My drive: display files and folders (list view)
* display folder contents (list view)

3. Navbar
* Display navlinks (with navigation)
* Create folder (folder context)
* Upload file (folder context)
* Upload folder (folder context with structure)

4. Files/Folder list view
* Display files & folders in list view
* Show options (download, rename, organise, share, move to trash)
* Rename option


## Todo
* Breadcrumbs
  - show only last three segments
  - show dropdown button for hidden segments for navigation
* FileUploadToast
  - add scroll to the toast when exceeds threshold height
* FileListView
  - add scroll when exceeds some height threshold
* Upload Route
  - upload file with path
