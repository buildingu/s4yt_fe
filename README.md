# s4yt_fe
Welcome to the special event/game front-end repository for Building-u, called Dollars for Your Thoughts ($4YT), 2025. The project is for the interns from Building-u.

The point system is a focal point, players can earn `Dubl-u-nes` and spend them on raffle items provided by the raffle partners, and even complete a business challenge for real cash. For a brief explanation, the game runs through `periods`, starting with `pre_game`, where players answer multiple-choice questions from business partners, they open chests and answer the questions for dubl-u-nes. Once everyone is done earning dubl-u-nes, next is the `game_start` period. Business challenges are open, and the interns would start placing dubl-u-nes on raffle items. After that, businesses review the challenges, pick winners, and the raffle drawing commences for the raffle item winners. 

The periods are controlled by timestamps, explained more below.

## Timestamps
The state for the timestamps is located in `src/redux/reducers/gameConfig.ts`.
### Periods
When all timestamps are before, so the game hasn't started, **restrictedAccess** is set and they are only allowed to the profile.

Note that throughout these periods, the **profile page** is always opened, except for `game_end`, of course.
- `pre_game`: Everyone begins to learn more about the businesses by completing multiple-choice questions and earn dubl-u-nes.
- `game_start`: Business challenge questions are opened, and the **Learn and Earn** and **Event Results** pages are closed.
- `review_start`: **Challenge submissions** and the **raffle** are now in review. The **game is closed**, but only for the **player role**.
- `review_end`: Winners are now shown, and everyone can only access the **Event Results page** and the game remains closed.
- `game_end`: End of the 'game' and the **Game Closed page** is always shown after login.

## Tech Used
This is a `TypeScript` `React` application built using `Vite`. The app also uses `Redux` for efficient state management, and utilizes `CSS modules` for styling.

## Getting Started
- Nodejs version 22 or greater.
- NPM version 10 or greater.
- Run "npm install" to install all dependencies or, more favorably, "npm ci".
- "npm run dev" to run the project in development mode.

## Directory Structure
To maintain good development practices and consistency across files/directories, we recommend using the same guidelines and structure as follows if you're building upon the code. In this project, we used a `reusable architecture` for all directories, so create a new `component` only if it is used in more than one file, the same goes for `utils`, `constants`, and the other directories. I am only going to be explaining things that I think are important to know and clarify aspects that may not be self-explanatory:

### components
- Each component has a directory as the name of the component and must include `index.tsx` and `styles.module.css` files.
- We use `Layout` and `Content` components, kind of like Nextjs, and they should be used in every `view`.
- The `Redirects` component is the 'gateway' component, which is wrapped around every route.
- `src/components/forms/user` is the user form meaning where the user registers and edits their profile, it serves as both.

### redux
- The `gameConfig` reducer is where all game-specific 'configurations' are, e.g. the `timestamps` for the countdown, and each `period` of the game as explained above in the Timestamps section.
- The `game` reducer is for a number of things; mulipating the coins (dubl-u-nes), learn and earn chests, raffle, etc.
- The `user` reducer is for updating the state of the user and the user session.
  - Notable reducers are only listed, there is more.
- The `actions` handles the `API calls`, essentially every action is a `redux-thunk`.
<br />

```
/
├── .env
├── vite.config.ts
├── package.json
├── postcss.config.js
├── tsconfig.json
├── ...
├── node_modules/
|   └── ...
├── public/
│   ├── fonts/
|   |   └── ...
│   ├── images/
|   |   └── ...
│   ├── favicon-32x32.png
|   ├── favicon.ico
|   ├── site.webmanifest
|   └── ...
└── src/
    ├── index.jsx
    ├── index.css
    ├── store.js
    ├── ...
    ├── components/
    |   ├── carousel/
    |   |   ├── index.tsx
    |   |   └── styles.module.css
    |   ├── forms/
    |   |   ├── controls/
    |   |   |   ├── Input.tsx
    |   |   |   └── ...
    |   |   ├── password/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   ├── user/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   └── ...
    |   ├── image/
    |   |   ├── index.tsx
    |   |   └── styles.module.css
    |   ├── loaders/
    |   |   ├── overlayLoader/
    |   |   |   └── ...
    |   |   ├── spinner/
    |   |   |   └── ...
    |   ├── modals/
    |   |   ├── ModalTemplate.tsx
    |   |   ├── areYouSure/
    |   |   |   └── ...
    |   |   ├── challenge/
    |   |   |   ├── details/
    |   |   |   |   └── ...
    |   |   |   └── instructions/
    |   |   |       └── ...
    |   |   └── ...
    |   ├── notification/
    |   |   ├── index.tsx
    |   |   └── styles.module.css
    |   ├── partials/
    |   |   ├── content/
    |   |   |   ├── Input.tsx
    |   |   |   └── ...
    |   |   ├── currentCoins/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   ├── header/
    |   |   |   ├── index.tsx
    |   |   |   ├── Hamburger.tsx
    |   |   |   └── styles.module.css
    |   |   ├── layout/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   └── status(footer)/
    |   |       ├── index.tsx
    |   |       └── styles.module.css
    |   └── ...
    |    
    ├── constants/ 
    |   ├── emailRegex.js
    |   ├── treasureMapNavContent.js
    |   └── uuidRegex.js
    |    
    ├── hooks/
    |   ├── useContinueCountdown.ts --- To keep the countdown moving, which is displayed in the status component and gameEnd files.
    |   └── useRefreshReduxPersister.ts
    |
    ├── redux/
    |   ├── actions/
    |   |   ├── businesses.js
    |   |   ├── game.js
    |   |   ├── gameConfig.js
    |   |   ├── notifications.js
    |   |   ├── user.js
    |   |   ├── index.js
    |   |   └── ...
    |   └── reducers/
    |       ├── businesses.ts
    |       ├── game.ts
    |       ├── gameConfig.ts
    |       ├── notifications.ts
    |       ├── user.ts
    |       ├── index.js
    |       └── ...
    |
    ├── routes/
    |   ├── disableOn.ts
    |   ├── Redirects.jsx
    |   └── index.jsx --- holds data about the routes and the RoutesProvider, which is used in the base index.tsx file.
    |
    ├── services/
    |   ├── errorHandler.js
    |   ├── ResourceLoader.tsx --- loads Socket.io connection, etc.
    |   ├── socket.ts
    |   ├── SocketBackgroundListeners.tsx
    |   └── index.js
    |    
    ├── typings/ --- All types are done in their respective files unless they need to be used elsewhere then they are put here.
    |   ├── NotificationValues.ts
    |   └──  UserCredentials.ts
    |
    ├── utils/
    |   ├── copyToClipboard.ts
    |   ├── delay.ts
    |   ├── History.ts --- Use this instead of useNavigate.
    |   └── forms/
    |       ├── checkMatchingPasswords.ts
    |       ├── checkValidEmail.ts
    |       ├── checkValidity.ts
    |       ├── updateField.ts
    |       └── ...
    |
    ├── views(pages)/ --- the views are separated by game (main pages), user (auth pages), and errors (universal) directories for clarity.
    |   ├── errors/
    |   |   ├── index.tsx
    |   |   ├── Error404.tsx
    |   |   ├── Error500.tsx
    |   |   ├── styles.module.css
    |   |   └── ...
    |   ├── game/
    |   |   ├── businesses/
    |   |   |   ├── index.tsx
    |   |   |   ├── Details.tsx
    |   |   |   └── styles.module.css
    |   |   |       └── slides/
    |   |   |           └── ...
    |   |   ├── gameClosed/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   ├── home/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   ├── learnAndEarn/
    |   |   |   ├── index.tsx
    |   |   |   ├── Questions.tsx
    |   |   |   └── styles.module.css
    |   |   ├── raffle/
    |   |   |   ├── index.tsx
    |   |   |   └── styles.module.css
    |   |   └── results/
    |   |       ├── index.tsx
    |   |       ├── styles.module.css
    |   |       └── ...
    |   └── user/
    |       ├── login/
    |       |   ├── index.tsx
    |       |   └── styles.module.css
    |       |       └── forgot/
    |       |           └── ...
    |       ├── profile/
    |       |   ├── index.tsx
    |       |   ├── Coins.tsx
    |       |   ├── Referrals.tsx
    |       |   └── styles.module.css
    |       |   └── ...
    |       ├── register/
    |       |   └── index.tsx
    |       |       └── verifyEmail/
    |       |           └── ...
    |       └── resetPassword/
    |           └── index.tsx
    └── ...
```
