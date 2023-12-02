# LetsDoHobby

letsdohobby is a community Web App where people find the right partner for their hobbies.
The slagen is (LDH)

## Note

Currently available on https://hobby.kawaraa.com and soon will be officially available on https://letsdohobby.com

## The App Benefits

- It solve 5 problems for people who miss practicing what they love as a hobby.
  1- To connect like-minded people and people with similar interests with each other locally.
  2- To help people find their hobby partner or group of people in purpose of practicing their hobbies.
  3- To help people find who can teach them a specific activity.
  4- To help people become better at their hobby by teaching it to others
  5- It brings fun and fulfillment to your life by allow people leave the internet and social media and go experience and enjoy the real live

## App Features

- Visitors can see the online/offline Users and groups in the same area, only if they enable the location otherwise no result will show.
- Visitors can not interact with the online Users, join groups or see a User’s profile unless he becomes a User.
- Visitor can become a User by creating an account.
- Visitors/Users can search based on specific criteria
- User can Delete his account.
- User can create a group as a post with specific hobby or activity
- Users can join a posted group, and start a chat with each other.
- User
- Tutoring and Mentoring Feature

## Tips for getting started as a volunteer

- First, ask yourself if there is something specific you want to do. For example,
- Do I want to improve the neighborhood where I live?
- Do I want to meet people who are different from me?
- Do I want to try something new?
- do I want to do something in my free time?
- do I want to see a different way of life and new places?
- do I want to have a go at the type of work I might want as a full-time job?
- do I want to do more with my interests and hobbies?
- do I want to share something I’m good at?
- The best way to volunteer is to find a match with your personality and interests. Having answers to these questions will help you narrow down your search.

## Domain

letsdohobby.com

### Public Pages Routes

- `/` The welcoming page includes login and signup
- `/web` The posts list that contains the recent 20 posts
- `/web/post/:id` The post details

### Private Pages Routes

- `/` The News feed page
- `/profile` The user profile
- `/member/:id` The member profile
- `/settings` The user settings
- `/posts/:id` The post details
- `/my-posts` The posts I have created and the posts I have joined

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

### Search Criteria

- Location / City
- Hobbies

  - Sport:

    Gym,
    Exercise,
    Pilates,
    Swimming,
    Running/Jogging,
    Soccer/Football,
    Flag football/Rugby,
    Handball,
    Badminton,
    Field Hockey,
    Volleyball,
    Basketball,
    Tennis,
    Cricket,
    Table Tennis,
    Baseball,
    Golf,
    Yoga,
    Taekwondo,
    Karate,

  - Winter

    Skiing,
    Ice skating,
    Snowboarding,
    Snowshoeing

  - Indoor

    Acrobatics,
    Baton twirling,
    Juggling,
    Bowling,
    Book discussion,
    Board games,
    Card games,
    Jigsaw Puzzle,
    Crossword puzzle,
    Coloring = art,
    Knitting/Crocheting = art,
    Embroidery = art,
    Needlepoint = art,
    Jewelry making = art,
    Cue sports/Billiard/Pool,
    Dance,
    Hula hooping,
    Sketching/Drawing/Painting,
    Pottery,
    Woodworking,
    Crafting,
    language learning,
    Singing,
    Playing musical instruments,
    Watching movies,
    Makeup,
    Backgammon,
    Chess,
    Stand-up comedy,
    Poetry

  - Outdoor

    Backpacking,
    Trail running,
    Climbing,
    Rock Climbing,
    Parkour,
    Inline skating/roller skating/Rollerblade,
    Skateboarding,
    Longboarding,
    Cycling,
    BMX Bike,
    Snorkeling,
    Scuba Diving,
    Bowhunting,
    Surfing,
    Windsurfing,
    Kitesurfing,
    Wakeboarding,
    Sailing,
    Kayaking,
    Rafting,
    Walking/Wondeling,
    Sun tanning,
    Backpacking,
    Hiking,
    Horseback riding,
    Archery,
    Beekeeping,
    Camping,
    Flying Disc,
    Gold prospecting,
    Hunting,
    Sand art,
    Shooting,
    Skydiving,
    Slacklining,
    Waterskiing,
    Travel

### Resources

-https://www.helpguide.org/articles/healthy-living/volunteering-and-its-surprising-benefits.htm
