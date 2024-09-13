Overview:
Server: This is a RESTful API that supports functionalities for both unauthenticated and authenticated users. An unauthenticated user can sign up or log in securely using JWT authentication. Once authenticated, users can perform various actions including viewing all movies in the database, editing user data, adding or deleting movies from a FavoriteMovies array, and deleting their account. This is the backend of the app, the frontend is built in MyMovies-Client.

Key Features:

1. User Authentication: Secure sign-up and login for users using JWT tokens.
2. CRUD Operations: Perform Create, Read, Update, and Delete operations on movie data.
3. Favorite Movies: Users can add or remove movies from their list of favorites.
4. Account Management: Users can delete their accounts, which deletes associated data from the database.
5. Validation: Input validation using express-validator to ensure data integrity and security.
6. Logging: Use of Heroku logs for monitoring and debugging during development.

Data Source:
This app pull data from a MongoDB Atlas database that I populated.

<p>Website: https://my---movies-868565568c2a.herokuapp.com/</p>
<p>ClientSide Website (React): main--react-mymovies.netlify.app/</p>
<p>ClientSide GH Repo (React): https://github.com/leanneduyck/MyMovies-Client.git</p>
<p>Clientside Webiste (Angular): https://my-movies-angular.vercel.app/</p>
<p>Clientside GH Repo (Angular): https://github.com/leanneduyck/myMovies-Angular.git</p>

Technologies Used:

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

Setup Instructions:

Database:

<p>1. Create MongoDBAtlas account if necessary.</p>
<p>2. Create a new cluster and database</p>
  <p>a. Whitelist your IP address.</p>
  <p>b. Obtain connection string for MongoDB Atlas database</p>
  <p>c. Update .env file with MONGODB_URI and JWT_SECRET</p>

Local Setup:

<p>1.Install Node.js:</p> 
  <p>a. Ensure Node.js LTS version is installed by running: nvm install --lts</p>
<p>2. Install Packages:</p> 
  <p>a. Navigate to the project directory and install dependencies by running: npm install</p>
<p>4. Start Local Server:</p> 
  <p>a.Run the server locally by running: npm start / npm start node.js / npm run dev</p>

Deployment to Heroku:

<p>1. Push Changes: Push changes to your Heroku remote branch by running: git push heroku main (or git push origin main)</p>
<p>2. Check Logs: Monitor logs on Heroku for any errors or debugging messages by running: heroku logs --tail</p>

Github:
To push:

1. Run: git add .
2. Run: git commit -m "Your commit message"
3. Run: git push

Documentation:

<p>1. Add block comments to code with tags according to https://jsdoc.app/</p>
<p>2. Install JSDoc by running: npm install -g jsdoc</p>
<p>3. Create jsdoc.json file, see my file for specifics</p>
<p>4. Add "doc": "jsdoc -c jsdoc.json" to package.json scripts</p>
<p>5. Run: npm run doc</p>
<p>6. View generated documentation in newly generated docs folder, open any in live server to view all official documentation</p>
