# tinyblog

tinyblog is a lightweight, open-source microblogging platform that allows users to share short posts, follow other users, and engage in simple social interactions. It's designed to be easy to set up, lightweight, and accessible for developers and users alike.

## Features

- 📜 Microblogging: Share short posts with your followers.
- 👫 User Profiles: Create profiles, follow other users, and grow your network.
- 💬 Real-Time Interaction: Users can like, comment, and interact with posts.
- 🔐 Authentication: User sign-up and login functionality.
- 💻 Responsive Design: Optimized for mobile and desktop users.

## Principles

At tinyblog, we are committed to transparency, privacy, and creating a feed driven by genuine social connections. Our core principles are:

- 🕒 No Algorithm-Driven Feeds: Users will only see posts from the accounts they follow, displayed in chronological order.
- 👥 Follower-Driven Experience: All content is based on who you follow, with no content promotions or algorithmic suggestions.
- 📢 Ads, but No Tracking: We will show ads to support the platform, but no user tracking or behavioral data collection will be involved.
- 🚫 No Personalized Ads: Ads are non-intrusive and not tailored based on user profiles or activity.
- 🔍 Transparency: Our platform will always operate with full transparency about how content and ads are displayed.
- 🗓️ Historical Integrity: Feed data will always be chronological and historically accurate—no curated or manipulated posts.
- 🔒 Data Privacy: User data will not be sold or shared with third parties. You control your data.
- 🌱 Community-Driven Growth: Organic growth will be encouraged through genuine user interactions, not artificial engagement techniques.

## Why Not Decentralized Network?

While decentralized networks have their appeal, we believe they pose significant challenges for the average user. Here are the key disadvantages:

- 🛠️ Complex Setup: Users must find and join a node, which requires technical knowledge.
- 🔍 Difficult to Discover: It’s hard for users to discover the right communities or instances without a centralized directory.
- 🏗️ Trust Issues with Nodes: Users need to place trust in smaller node providers, which may not be reliable or secure.
- ⚙️ Fragmented Experience: Different nodes can have different rules, moderation standards, and features, leading to inconsistent user experiences.
- 🌐 Scaling Problems: Decentralized networks struggle with scaling, which can result in slower performance or node overloads.
- 🤝 Interoperability Challenges: Communication between different instances or networks is not always smooth, leading to isolation or incomplete connectivity.

## Demo

To see tinyblog in action, check out the live demo [here](https://tinyblog.space).

## Development

This repository contains two projects;

- `app`: React application for frontend with TypeScript, Vite and Tailwind.
- `api`: Node.js API application for backend with [Axe API](https://axe-api.com/)

The backend uses MySQL and Redis.

### App

Frontend application

```bash
$ cd app
$ npm install
$ npm run dev
```

### API

You should have MySQL and Redis instance on your machine. Also, you should provide the correct information for the `.env` file.

```.env
NODE_ENV=development
APP_PORT=3005
DB_CLIENT=mysql2
DB_DATABASE=tinyblog
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
LOG_LEVEL=warn
LOG_TRANSPORT=pino-pretty
DOCS=true
APP_SECRET=12345678
DOMAIN=http://localhost:5173
REDIS_URL=redis://default@localhost:6379

TURNSTILE_SITEKEY=1x0000000000000000000000000000000AA
```

After the .env configuration you can run your application.

```bash
$ cd api
$ npm install
$ npm run dev
```

## Roadmap

We have an exciting vision for tinyblog, and we’re working hard to bring new features and improvements to the platform. Below is a rough roadmap of what’s to come:

- [x] User Authentication (Sign-up, Login, Logout)
- [x] Basic User Profiles
- [x] Create, Edit, Delete Posts (up to 240 characters)
- [x] Follow/Unfollow Users
- [x] View Feed with posts from followed users
- [x] Like and Comment on posts
- [ ] Private Messaging between users
- [x] Hashtags and tagging system for posts
- [x] Link system on posts
- [x] User Analytics (Followers count, post engagement stats)
- [x] Bot protection (Cloudflare turnstile)
- [x] Rate limiting
- [x] Progressive Web App (PWA) support
- [x] Notifications for follows, likes, and comments
- [ ] User Settings (Update Profile, Change Password)
- [ ] Search functionality for posts and users
- [ ] Advanced moderation tools (content flagging, spam detection)
- [ ] Multi-language support

## Contributors

<a href="https://github.com/ozziest/tinyblog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ozziest/tinyblog" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
