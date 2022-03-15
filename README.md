# NodeJS RESTful API to signup, signin and search for users

## Usage

1 - Clone the repository
<br>
2 - Run ```npm install```

## Requesting

-First identify the port the server is listenning (3000 by default, but if it can change you configure another port to Node environment variables).

-There are 4 routes to handle requests (get all users, get one user, sign up and sign in):

<strong>localhost:{port}/user/</strong> - GET - Returns all users (Must be authenticated)
<br>
<br>
<strong>localhost:{port}/user/:{id}</strong> - GET - Returns a specific user (Must be authenticated)
<br>
<br>
<strong>localhost:{port}/user/signup</strong> - POST - Register a new user (Must send a json object with at least "nome", "email" and "senha" fields. All of them are String type)
<br>
<br>
<strong>localhost:{port}/user/signin</strong> - POST - Login a user (Must send a json object with "email" and "senha" fields. All of them are String type)
<br>
<br>

## Database
  
This application uses a Mongo database, hosted in the USA and could be used to test.
