# sveltekit-firebase-multi-tenancy

This is an example or POC of how to use SvelteKit with Firebase Auth and Firestore and how to model your Firestore for multi-tenancy. It also includes Tailwind CSS integration as a bonus.

The app uses Firebase emulator for Firestore and Firenbase Auth locally. To get run do `pnpm i && pnpm start`. The app does not follow any recommended structure, only minimal to get things to work. There is also Firebase functions project included, but it's empty because no cloud functions are uses in this example. It uses SvelteKit demo as starting project.

## App Requirements

- Users should only be able to access data in the company they belong to
- Users should only be able to access their own data in the top users collection

## Domain Model

- A company has many jobs to do
- A job can only be done by one company and company's employees
- An employee (user) belongs to one company
- One company has may employees

## What it does

- Starts SvelteKit app and Firebase emulator in one command
- Firestore rules are applied automatically in emulator
- Shows how to set custom claims for users in Firebase Auth
- Shows how create users and data in Firestore from commandline using Firebase admin
- Shows how to get same data from Firestore in slightly different ways

## What it does not

Handle any errors. Happy path all the way!

## Top of the head thoughts

- Remember that Firstore only works in the browser
- If you want to use it on the server, for example to fetch public data, use firebase-admin lib (not included)
- If you don't disable SSR in SvelteKit you have to use dynamic imports for Firestore
- Firestore security rules are crucial to get right. Can't *emphasize* it **strongly** enough!
- There is no right way to model data in Firestore, but always think data duplication and model data based on your app's views
- If you need to do some admin stuff use Firebase functions and call them from your app. You get more freedom and security
- I don't think that Firebase Auth works on the server, but not 100% sure. Maybe more like 95%

## Seed data 

To create new user and company pair in Firebase emulator run the command when the emulator is running.

`$ ./create_org_and_user.js --name "Google" --email larry@google.com`

Do it at least twice so you get at least two companies.

**IMPORTANT**

In order for Firebase admin to connect to Firebase emulator you have to export a couple of system variables. See `.env` file.

## Important files

- create_org_and_user.js
- src/lib/firebase.ts
- src/lib/auth.ts
- src/lib/store.ts
- src/routes/__layout.svelte
- src/routes/index.svelte

## Disclaimer

I take no responsibility if you use the examples and something goes wrong. Use at your own risk and use your judgement.

## More Knowledge

If you want to learn more feel free follow me on [Twitter](https://twitter.com/codechips) or step by my blog - [codechips.me](https://codechips.me).