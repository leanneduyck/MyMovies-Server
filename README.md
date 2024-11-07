# MyMovies-Server

**CURRENT WORKING BRANCH IS 'PREVIOUS'**

## Overview:

Server: This is a RESTful API that supports functionalities for both unauthenticated and authenticated users. An unauthenticated user can sign up or log in securely using JWT authentication. Once authenticated, users can perform various actions including viewing all movies in the database, editing user data, adding or deleting movies from a FavoriteMovies array, and deleting their account. This is the backend of the app, the frontend is built in MyMovies-Client.

## Key Features:

1. User Authentication: Secure sign-up and login for users using JWT tokens.
2. CRUD Operations: Perform Create, Read, Update, and Delete operations on movie data.
3. Favorite Movies: Users can add or remove movies from their list of favorites.
4. Account Management: Users can delete their accounts, which deletes associated data from the database.
5. Validation: Input validation using express-validator to ensure data integrity and security.
6. Logging: Use of Heroku logs for monitoring and debugging during development.

## Data Source:

This app pulls data from a MongoDB Atlas database that I populated.

- Website: [https://my---movies-868565568c2a.herokuapp.com/](https://my---movies-868565568c2a.herokuapp.com/)
- ClientSide Website (React): [https://main--react-mymovies.netlify.app/](https://main--react-mymovies.netlify.app/)
- ClientSide GH Repo (React): [https://github.com/leanneduyck/MyMovies-Client.git](https://github.com/leanneduyck/MyMovies-Client.git)
- Clientside Website (Angular): [https://my-movies-angular.vercel.app/](https://my-movies-angular.vercel.app/)
- Clientside GH Repo (Angular): [https://github.com/leanneduyck/myMovies-Angular.git](https://github.com/leanneduyck/myMovies-Angular.git)

## Technologies Used:

1. MongoDB Atlas: Hosts the database, ensuring scalability and availability.
2. Express: Provides the framework for building the API endpoints.
3. Node.js: JavaScript runtime environment for executing server-side code.
4. Heroku: Platform for deploying, managing, and scaling the application.
5. Postman: Used for testing API endpoints and ensuring functionality.
6. JWT Authentication: Provides secure authentication and authorization.
7. Password Hashing: Ensures user passwords are securely stored using hashing techniques.
8. Mongoose: Models the business logic and interacts with MongoDB.
9. Body-Parser: Middleware for reading data from requests.
10. Morgan: Middleware for logging HTTP requests.
11. Package.json: File for managing project dependencies and scripts.
12. Data Validation: Ensures data integrity and security.
13. Error Handling: Ensures the JavaScript code is error-free.
14. JSON: Format for providing movie information.
15. Deployment: Heroku.

## Setup Instructions:

### Database:

1. Create MongoDB Atlas account if necessary.
2. Create a new cluster and database:
   - Whitelist your IP address.
   - Obtain connection string for MongoDB Atlas database.
   - Update `.env` file with `MONGODB_URI` and `JWT_SECRET`.

### Local Setup:

1. Install Node.js:
   - Ensure Node.js LTS version is installed by running: `nvm install --lts`
2. Install Packages:
   - Navigate to the project directory and install dependencies by running: `npm install`
3. Start Local Server:
   - Run the server locally by running: `npm start` / `npm start node.js` / `npm run dev`

### Deployment to Heroku:

0. Automatically pushes main branch on Heroku when commits made.
1. **NOTE:** Manually deploy `previous` branch as commits are made (current working branch).
2. Push Changes: Push changes to your Heroku remote branch by running: `git push heroku main` (or `git push origin main`)
3. Check Logs: Monitor logs on Heroku for any errors or debugging messages by running: `heroku logs --tail`

## GitHub:

To push:

1. Run: `git add .`
2. Run: `git commit -m "Your commit message"`
3. Run: `git push`

## Documentation:

1. Add block comments to code with tags according to [JSDoc](https://jsdoc.app/)
2. Install JSDoc by running: `npm install -g jsdoc`
3. Create `jsdoc.json` file (see my file for specifics)
4. Add `"doc": "jsdoc -c jsdoc.json"` to `package.json` scripts
5. Run: `npm run doc`
6. View generated documentation in newly generated `docs` folder. Open any file in live server to view all official documentation.
