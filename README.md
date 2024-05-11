<p>This is a RESTful API built using Node.js with Express and MongoDB for a movie database application.</p>
<p>It sets up the backend for MyMovies-Client repo. An unauthenticated user can sign up or log in. An authenticated user can view all movies in the database, edit user data, add/delete movies from a FavoriteMovies array, and delete the user's account. These action are performed via CRUD operations. Authentication includes JWT and express-validator validation.</p>
<p>During the build process, I used Postam to test endpoints.</p>
<p>The database is currently stored on MongoDB Atlas (at the beginning of the build, it was stored on MongoDB), and the server is hosted on Heroku.</p>
<p>Techs Used:</p>
  <ul>
    <li>Mongo DB Atlas (initially MongoDB)</li>
    <li>Express</li>
    <li>Node.js</li>
    <li>Heroku</li>
    <li>Postman</li>
    <li>PW Hashing and JWT authentication</li>
  </ul>
 <p>Setup Instructions/Commands:</p>
   <ul>
     <li>Install Node: "nvm install --lts"</li>
     <li>Install Packages: be in working folder, "npm install"</li>
     <li>Add "node_modules" and ".env" to .gitignore file</li>
     <li>Start Local Server: "npm start node.js"</li>
     <li>Push Changes to Heroku: "git push Heroku main" / can also use "git push origin main"</li>
     <li>Check Heroku Errors: "heroku logs --tail"</li>
   </ul>
<p>Website: https://my---movies-868565568c2a.herokuapp.com/</p>








