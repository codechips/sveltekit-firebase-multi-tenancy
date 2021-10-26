#!/usr/bin/env node

import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import slugify from 'slugify';
import args from 'args';

const FIREBASE_PROJECT = 'testing-firebase-emulators';
const COMPANIES = 'companies';
const USERS = 'users';

args
  .option('name', 'Company name', 'Foobar, Inc')
  .option('email', 'Admin email', 'linda@example.com');

const flags = args.parse(process.argv);

// init Firebase app
initializeApp({ projectId: FIREBASE_PROJECT });

const firestore = admin.firestore();
const auth = admin.auth();

const Companies = firestore.collection(COMPANIES);
const Users = firestore.collection(USERS);

const createCompany = async (user) => {
  // grab company name from command line arguments
  const name = flags.name;
  // create company slug
  const slug = slugify(name, { lower: true });

  const payload = {
    name,
    slug,
    createdBy: user.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const companyRef = await Companies.add(payload);

  // create fake jobs
  const jobs = [...Array(5).keys()].map((i) => `${name}: Job ${i + 1}`);
  const batch = firestore.batch();

  // add jobs to Firestore batch
  jobs.forEach((job) => {
    const docRef = companyRef.collection('jobs').doc();
    batch.set(docRef, {
      title: job,
      createdBy: user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();

  const companyDoc = await companyRef.get();
  const company = companyDoc.data();

  // add user to the root users collection
  await Users.doc(user.uid).set({
    role: 'admin',
    isAdmin: true,
    email: user.email,
    companyId: companyDoc.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    active: true
  });

  // set company id and other roles to Firebase auth user
  auth.setCustomUserClaims(user.uid, { companyId: companyDoc.id, roles: ['admin'], admin: true });

  // Add user to a users collecton under company document too
  await companyRef.collection(USERS).doc(user.uid).set({
    role: 'admin',
    isAdmin: true,
    email: user.email,
    companyId: companyDoc.id,
    companySlug: company.slug,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    active: true
  });

  return companyDoc;
};

auth
  .createUser({
    email: flags.email,
    emailVerified: false,
    password: 'qwerty',
    displayName: flags.email,
    disabled: false
  })
  .then((userRecord) => {
    console.log('Successfully created new user:', userRecord.uid);
    return userRecord;
  })
  .then(createCompany)
  .then((company) => {
    console.log('Successfully created new company:', company.id);
  })
  .catch(console.log);
