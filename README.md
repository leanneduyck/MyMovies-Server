Overview:
This is a RESTful API that supports functionalities for both unauthenticated and authenticated users. An unauthenticated user can sign up or log in securely using JWT authentication. Once authenticated, users can perform various actions including viewing all movies in the database, editing user data, adding or deleting movies from a FavoriteMovies array, and deleting their account.

Key Features:

1. User Authentication: Secure sign-up and login for users using JWT tokens.
2. CRUD Operations: Perform Create, Read, Update, and Delete operations on movie data.
3. Favorite Movies: Users can add or remove movies from their list of favorites.
4. Account Management: Users can delete their accounts, which deletes associated data from the database.
5. Validation: Input validation using express-validator to ensure data integrity and security.
6. Logging: Use of Heroku logs for monitoring and debugging during development.

Data Source:
This app pull data from a MongoDB Atlas database that I populated.

Website: https://my---movies-868565568c2a.herokuapp.com/
ClientSide Website: main--react-mymovies.netlify.app/
ClientSide GH Repo: https://github.com/leanneduyck/MyMovies-Client.git

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

Setup Instructions/Commands:
Local Setup:
1.Install Node.js: Ensure Node.js LTS version is installed. Use nvm install --lts. 2. Install Packages: Navigate to the project directory and install dependencies with npm install. 3. Environment Variables: Add a .env file to manage environment variables like database URI and JWT secret. 4. Start Local Server: Run the server locally with npm start node.js.

Deployment to Heroku:

1. Push Changes: Push changes to your Heroku remote branch using git push heroku main or git push origin main.
2. Check Logs: Monitor logs on Heroku for any errors or debugging messages using heroku logs --tail.
