/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
  userid: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  companyId?: string;
  admin: unknown;
  roles?: unknown;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
}

export interface Job {
  id: string;
  title: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
