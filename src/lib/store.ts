import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore';

import { db } from '$lib/firebase';
import type { Job } from './types';

const COMPANIES = 'companies';

export const getJobById = async (companyId: string, id: string): Promise<Job | null> => {
  const jobRef = doc(db, `${COMPANIES}/${companyId}/jobs/${id}`);
  const jobSnap = await getDoc(jobRef);
  return jobSnap.exists() ? <Job>{ id: jobSnap.id, ...jobSnap.data() } : null;
};

// you could also use this function together with `onSnapshot` for realtime changes
export const getJobsQuery = (companyId: string, thisMany: number = 5) => {
  const jobsRef = collection(db, `${COMPANIES}/${companyId}/jobs`)
  return query(jobsRef, orderBy("createdAt", "desc"), limit(thisMany));
}

export const getJobs = async (companyId: string): Promise<Job[]> => {
  const q = getJobsQuery(companyId, 10);
  const jobs = await getDocs(q);
  return jobs.docs.map<Job>((doc) => <Job>{ id: doc.id, ...doc.data() });
};

export const createJob = async (companyId: string, payload: Partial<Job>) => {
  const now = Timestamp.fromDate(new Date());
  const data = { ...payload, createdAt: now, updatedAt: now }
  console.log(data);
  return addDoc(collection(db, `${COMPANIES}/${companyId}/jobs`), data)
}

export const getJobsBySlug = async (slug: string): Promise<Job[]> => {
  const companiesRef = collection(db, COMPANIES);

  // This qiery is not permitted because users are not allowed to read companies collection
  const q = query(companiesRef, where('slug', '==', slug));
  const docs = await getDocs(q);

  if (docs.empty) {
    return [];
  } else {
    const companyRef = docs.docs[0];
    await getJobs(companyRef.id);
  }
};
