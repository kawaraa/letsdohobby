# LetsDoHobby

letsdohobby.com is a platform where people find the right partner for their hobbies.

## Note

Currently available on https://hobby.kawaraa.com and soon will be officially available on https://letsdohobby.com

## Domain

### Private Pages Routes

- `/` The News feed page
- `/profile` The user profile
- `/member/:id` The member profile
- `/settings` The user settings
- `/posts/:id` The post details
- `/my-posts` The posts I have created and the posts I have joined

### Public Pages Routes

- `/` The welcoming page includes login and signup
- `/web` The posts list that contains the recent 20 posts
- `/web/post/:id` The post details

### API Routes

- POST `/api/signup` Create a new account
- POST `/api/login` Log the user in
- All Methods `/api/logout` Log the user out
- GET `/api/confirm/:token` Confirm Email/Phone on signup
- POST `/api/avatar` Add an avatar
- PUT `/api/avatar` Update the avatar
- DELETE `/api/avatar` Delete an avatar
- POST `/api/chat` Create a message
- GET `/api/chat` Get unseen chats
- GET `/api/chat/list` Get the chat list
- GET `/api/chat/:id` Get the chat messages
- POST `/api/group/join/:id` Request to join an activity
- DELETE `/api/group/cancel/:id` Cancel the join request
- DELETE `/api/group/reject` Reject the join request
- POST `/api/group/accept` Accept the join request
- GET `/api/member/:id` Get the member profile
- GET `/api/notification` Get unseen notifications
- GET `/api/notification/list` Get the notifications list
- POST `/api/post` Create post
- GET `/api/post` Get the recent 20 posts
- GET `/api/post/member` Get the post I have joined
- GET `/api/post/:id` Get post details
- PUT `/api/post` Update post
- DELETE `/api/post/:id` DELETE
- PUT `/api/post/my-posts` Get the posts I have created
- POST `/api/post/report/:id` Report post
- All Methods `/api/user/state` Check if the user is logged in
- POST `/api/user/username` Update the username
- POST `/api/user/psw` Update the Password
- POST `/api/user` Delete the whole account
- GET `/api/user/profile` Get the user profile
- POST `/api/user/profile/full-name` Update the full name
- POST `/api/user/profile/about` Update the user about
- PUT `/api/user/profile/activity` Update the user favorite activities
- PUT `/api/user/settings` Update the user settings
- GET `/api/user/settings` Get the user settings

### WS Events

- `ADD_NOTIFICATION` Update the post
- `NEW_MESSAGE` Send a message to chat
- `REMOVE_NOTIFICATION` Add or Remove a user to and from the
