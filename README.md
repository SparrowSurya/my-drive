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


## Progress

0. Misc
* 404 page (common for all)
* Database (local)
* Home page
* File Upload Toast

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
* file(s)/folder(s) upload via drag drop

3. Navbar
* Display navlinks (with navigation)
* Create folder (folder context)
* Upload file (folder context)
* Upload folder (folder context with structure)

4. Files/Folder views
* Display files & folders in list/grid view
* Show options (download, rename, organise, share, move to trash)
* Rename option

5. Home
* File suggestions
* Folder suggestions

## Partially Tested
* Preview text file contents
* verify the magic numbers for mime types


## TODO
* Move to trash
  * Page
  * Option menu item
    * Confirmation dialog
  * Trash Option menu
  * Trash table
  * New Column in ListView
    * Original location (as location): My Drive, Folder Name or Shared with me
  * What Happens to files/folders inside when you delete a folder
* Organise file/folder
* Recent
* Search
* Activity
* Share
* Versions
* Sort & Filters
* Storage

## LATER
* Preview in grid view.
