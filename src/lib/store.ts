import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { Job } from './types';

const COMPANIES = 'companies';

export const getJobById = async (companyId: string, id: string): Promise<Job | null> => {
  const jobRef = doc(db, `${COMPANIES}/${companyId}/jobs/${id}`);
  const jobSnap = await getDoc(jobRef);
  return jobSnap.exists() ? <Job>{ id: jobSnap.id, ...jobSnap.data() } : null;
};

export const getJobs = async (companyId: string): Promise<Job[]> => {
  const jobs = await getDocs(collection(db, `${COMPANIES}/${companyId}/jobs`));
  return jobs.docs.map<Job>((doc) => <Job>{ id: doc.id, ...doc.data() });
};

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
