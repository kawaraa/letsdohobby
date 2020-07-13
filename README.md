# LetsDoHobby

letsdohobby.com is a platform where people find the right partner for their hobbies.

## Domain

### Pages routes

- `/` Home page / The News feed
- `/profile` The user profile
- `/user/id` Show the user profile
- `/post/id` Show the post

### api routes

- `/signup` Post, Create a new account
- `/login` Post, Log the user in
- `/logout` All Methods, Log the user out

### WS Events

- `LOGIN` The user is online
- `LOGOUT` The user is offline
- `POST` Create a new post
- `UPDATE_POST` Update the post
- `GROUP_MEMBER` Add or Remove a user to and from the group
- `MESSAGE` Send a message to chat
- `RECEIVED` Message received. id and true/false
- `TYPE` The user is typing
- `STOP_TYPE` The user stopped typing
- `NOTIFICATION` Notify the user when is a new ad is posted
