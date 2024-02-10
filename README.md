# nodejs-user-blog_post-crud-management-system-typescript-mongodb

For login purpose, I have already seed the user data for the login purpose as a admin
using this commands:
//compile - npx tsc src/seeder/user.seed.ts
//to run js - node src/seeder/user.seed.js

//first compile project with the commands – npx tsc
//to start the project – node dist/app.js

//admin login credentials
email – techadmin@example.com  
password - Admin@123


***If any issues to seed the data, I have attached the collections of users, file name as – ‘test.users.json’ ***

# Route Handlers Documentation

## User Routes

### GET /api/user/currentUser

- Description: Retrieves details of the currently logged-in user.
- Authentication Required: Yes

### GET /api/user/:id

- Description: Retrieves details of a user by their ID.
- Parameters:
  - `id`: The ID of the user to retrieve.
- Authentication Required: Yes

### PUT /api/user/:id

- Description: Updates details of a user or creates a new user if the ID does not exist.
- Parameters:
  - `id`: The ID of the user to update.
- Authentication Required: Yes

### DELETE /api/user/image/:id

- Description: Deletes the profile image of a user by their ID.
- Parameters:
  - `id`: The ID of the user whose profile image to delete.
- Authentication Required: Yes

### POST /api/user/changepassword

- Description: Changes the password of the currently logged-in user.
- Authentication Required: Yes

### GET /api/user/list

- Description: Retrieves a list of all users.
- Authentication Required: Yes & Admin Role

### POST /api/user/

- Description: Creates a new user
- Authentication Required: Yes & Admin Role

### PATCH /api/user/status/:id

- Description: Updates the status of a user by their ID.
- Parameters:
  - `id`: The ID of the user whose status to update.
- Authentication Required: Yes & Admin Role

### DELETE /api/user/:id

- Description: Deletes a user by their ID.
- Parameters:
  - `id`: The ID of the user to delete.
- Authentication Required: Yes & Admin Role

## Post Routes

### POST /api/post/

- Description: Creates a new post.
- Authentication Required: Yes

### GET /api/post/

- Description: Retrieves all posts.
- Authentication Required: Yes

### GET /api/post/:id

- Description: Retrieves details of a post by its ID.
- Parameters:
  - `id`: The ID of the post to retrieve.

### PUT /api/post/:id

- Description: Updates details of a post by its ID.
- Parameters:
- `id`: The ID of the post to update.

### DELETE /api/post/:id

- Description: Deletes a post by its ID.
- Parameters:
- `id`: The ID of the post to delete.

## Comment Routes

### POST /api/comments/

- Description: Creates a new comment.
- Authentication Required: Yes

### GET /api/comments/:postId

- Description: Retrieves all comments for a specific post.
- Parameters:
  - `postId`: The ID of the post to retrieve comments for.

### PUT /api/comments/:id

- Description: Updates details of a comment by its ID.
- Parameters:
  - `id`: The ID of the comment to update.

### DELETE /api/comments/:id

- Description: Deletes a comment by its ID.
- Parameters:
  - `id`: The ID of the comment to delete.
- Authentication Required: Yes

## Authentication Routes

### POST /api/auth/login

- Description: Logs a user in and returns an access token.
- Authentication Required: No

### POST /api/auth/logout

- Description: Logs a user out
 by invalidating the access token.
- Authentication Required: Yes

### POST /api/auth/token/refreshToken

- Description: Generates a new access token using a refresh token.

