<p align="center" style="font-weight:bold;">TRANSCENDENCE</p>
<p align="center" style="font-weight:bold;">Final project for 42's common core.</p>

![7d34a0f51fa821575d3bd374b0101034](https://github.com/Dieau/Transcendance/assets/13594148/5a00f072-1c11-4aff-9c77-9ecd6b98c74d)

## **Table of Contents**

1. [ Overview. ](#over)
2. [ Our Tech Stack. ](#stack)
3. [ Visual Overview. ](#visuals)
4. [ Database. ](#db)
5. [ Conclusion & Improvability. ](#conc)
6. [ Contributors. ](#cont)

<a name="over"></a>
## 1. Project Overview
Our Project offers a single-page application featuring a real-time multiplayer Pong game. Users can challenge other players online or engage in local matches against friends or AI opponents.


Key Features:

- Real-time multiplayer Pong game with online and local play options.
- Matchmaking system and leaderboards for fair competition.
- Game customization options.
- Chat and private messaging for seamless communication.
- Public, private, and protected channels for diverse conversations.
- Advanced security with 2FA, OAuth, and secure authentication managed by our custom backend.
- User profile customization, settings management, friendlists, and blocklists.
- Docker deployment.

<a name="stack"></a>
## 2. Tech Stack


**Here's a summary of the most important backend tech stack employed in this project:**


![backendts](https://github.com/Dieau/Transcendance/assets/13594148/7132143c-6026-4edc-8f92-6277276e3a21)

- NestJS: A comprehensive framework offering native TypeScript support. It follows an organized architecture comprising modules, controllers, and services.

- Prisma (our ORM): Providing protection against injections, automatic typing, and simplifying requests, Prisma offers additional features like Prisma Studio and thorough documentation.

- Passport (our authentication tool): Known for its user-friendly nature, it unifies code for all OAuth providers and includes SID (Session ID) management.

- GraphQL: Featuring comprehensive documentation, an Apollo playground, and advantages such as absence of JSON, support for nested objects, and the ability to select return fields.  
<br>

  
**Here's a summary of the frontend tech stack employed in this project:**

![frontendts](https://github.com/Dieau/Transcendance/assets/13594148/9e9a665f-ace7-4b85-85df-0e1abb66036d)


- Vue.js: A modern framework widely adopted for its ease of use, leveraging a component-oriented architecture. It integrates Vue router for seamless navigation.

- Konva.js: Offering multi-browser support, batch drawing, and rendering capabilities, this flexible and open-source library proves essential for our project.

- Socket.io: Powering real-time functionality, this library is user-friendly, well-documented, and facilitates game room management across various browsers.

- Elements+: Providing ease of use, versatile layout options, compatibility with our SCSS theme, and comprehensive documentation, Elements+ significantly contributed to our frontend.
<br>

<a name="visuals"></a>
## 3. Visual Overview
We were pretty happy with the outcome of our UI/UX, knowing none of us ever worked on web projects before.
Here you'll find some screenshots of different pages, and game parts of our website.

# Login Page
![unnamed (1)](https://github.com/Dieau/Transcendance/assets/13594148/54ae7142-96c4-4352-a05b-18c8c06db888)
Users can login through 4 different OAuth providers, or create a local account managed by us. Users can also opt for 2FA authentication for more security.

# Local Play
![unnamed (2)](https://github.com/Dieau/Transcendance/assets/13594148/6f530c83-d4ff-4bd4-8b60-a37953699bd3)
Users can choose between 2 local gamemodes: A local 1v1 where two players can play on the same keyboard, or challenge our bot to sharpen pong skills.

# Matchmaking
![unnamed (3)](https://github.com/Dieau/Transcendance/assets/13594148/8cfdaa5e-1b4c-44d9-8971-475f78792531)
Users can join competitive Matchmaking and keep browsing our website while searching for a game. A notification pops up when a game has been found!

# Competitive Game
![unnamed](https://github.com/Dieau/Transcendance/assets/13594148/9003cbc0-7c10-4924-a132-688ce9ff763a)
Once in the game, users must press ready for it to start. They can choose to vote for a 'Hard Mode', which speeds up ball and paddle speeds.

# Game Pause
![unnamed (1)](https://github.com/Dieau/Transcendance/assets/13594148/689d0b06-a4c7-40d7-b51c-32e1893ef2b7)
Users have the option to pause their online game at any given time. When resuming, another start countdown is set for players to prepare to fight.

# Game Over
![unnamed (2)](https://github.com/Dieau/Transcendance/assets/13594148/047574d9-8298-4c13-9358-92505bfe65ef)
A game is finished once a player reaches 11 points. The player performance is sent to the DB where we calculate their in-game effectiveness, winrate, and resilience for our leaderboards.

# Leaderboards
![unnamed (4)](https://github.com/Dieau/Transcendance/assets/13594148/d4b952fa-8e03-40bc-aaff-fa8b97a3a1bf)
A simple leaderboards page where users can check rankings, stats, and other player's performances.

# Chat & Messages
![unnamed (5)](https://github.com/Dieau/Transcendance/assets/13594148/9310afb1-5013-4a54-ad41-e9deb40964dc)
Here, users can join, create, manage, delete or edit channels! They can join public, protected, or private channels depending on their restrictions and user authorization.
Each channel can be managed and edited by its owner, or administrators. Privileges can be set or unset, and users can be muted, kicked, or banned of the channels.

# Profiles
![unnamed (6)](https://github.com/Dieau/Transcendance/assets/13594148/6a1a1184-d41a-4b31-9c66-6c8282b9579a)
Each user has his own Profile page, where he can see his game performances and access settings. He has a dedicated match history and game indicators. Users can also access their friendlist, adding or removing friends or even blocking them.
We also integrated user presences, you can see if other users are either online, in-game, or disconnected.

<a name="db"></a>
## 4. Database
**Here's a more representative view of our DataBase model:**  

![unnamed](https://github.com/Dieau/Transcendance/assets/13594148/f80e8d97-d2dd-4ffc-a6c3-81de651e2113)

<a name="conc"></a>
## 5. Conclusion
This project served as an exhilarating entry into web development, offering a steep learning curve despite my initial absence of experience in the field. The journey proved hard but enlightening, especially with the adoption of Prisma, which significantly expedited my comprehension of intricate database requirements. Similarly, the integration of GraphQL seamlessly streamlined backend operations, providing a substantial boost to productivity and efficiency.

Delving into frontend design was a captivating endeavor, although in retrospect, improvements in aesthetics and a more streamlined interface could have enhanced user experience. Nonetheless, considering it as a triumph for my maiden attempt, I acknowledge the room for growth and refinement in future projects.

As with most ambitious projects, time constraints necessitated compromises, limiting the depth of interactivity and additional features within the pong game. Reflecting on this, I envision enriching the pong experience further with additional bonuses and customization options given the opportunity.

Overall, this project laid a sturdy foundation, instilling confidence and a hunger to ascend higher, further honing my skills and expertise in the captivating realm of web development.

<a name="cont"></a>
## 6. Contributors
- [Robin Bony](https://github.com/RobinBONY)
- [Victor Ducoulombier](https://github.com/Elvicducou)
- [Adel Lakhdar](https://github.com/Dieau)
