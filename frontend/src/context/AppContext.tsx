// Global app state: a single source of truth for saved jobs + auth token
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { apiPost, apiDelete, apiGet } from '../lib/api';

interface Job {
  id: number;
  title: string;
  company_name: string;
  company_logo: string ;
  category: string;
  candidate_required_location: string;
  publication_date: string;
  url: string;
  description: string;
  salary: string;
  job_type: string;
}

interface AppCtx {
  savedJobs: Job[];
  saveJob: (j: Job) => Promise<void>;
  removeSavedJob: (id: number) => Promise<void>;
  isJobSaved: (id: number) => boolean;
  authToken: string | null;
  setAuthToken: (t: string | null) => void;
}

const AppContext = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [authToken, setAuthTokenState] = useState<string | null>(
    localStorage.getItem('auth_token')
  );

  // Load saved jobs from backend when user logs in
  useEffect(() => {
    if (authToken) {
      apiGet('/bookmarks')
        .then(data => {
          // Convert bookmark format to Job format for display
          const jobs: Job[] = (data.data || []).map((bm: any) => ({
            id: parseInt(bm.jobId),
            title: bm.jobTitle,
            company_name: bm.companyName,
            company_logo: '',
            category: '',
            candidate_required_location: '',
            publication_date: bm.createdAt,
            url: '',
            description: '',
            salary: '',
            job_type: '',
          }));
          setSavedJobs(jobs);
        })
        .catch(err => console.error('Failed to load saved jobs:', err));
    } else {
      setSavedJobs([]);
    }
  }, [authToken]);

  const saveJob = useCallback(async (job: Job) => {
    if (!authToken) {
      console.error('Cannot save job without authentication');
      return;
    }

    try {
      await apiPost('/bookmarks', {
        jobId: job.id.toString(),
        jobTitle: job.title,
        companyName: job.company_name,
      });
      setSavedJobs(prev => prev.some(j => j.id === job.id) ? prev : [...prev, job]);
    } catch (err) {
      console.error('Failed to save job:', err);
      throw err;
    }
  }, [authToken]);

  const removeSavedJob = useCallback(async (id: number) => {
    if (!authToken) {
      console.error('Cannot remove saved job without authentication');
      return;
    }

    try {
      await apiDelete(`/bookmarks/${id}`);
      setSavedJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
      throw err;
    }
  }, [authToken]);

  const isJobSaved = useCallback((id: number) => {
    return savedJobs.some(j => j.id === id);
  }, [savedJobs]);

  const setAuthToken = useCallback((token: string | null) => {
    setAuthTokenState(token);
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, []);

  return (
    <AppContext.Provider value={{ savedJobs, saveJob, removeSavedJob, isJobSaved, authToken, setAuthToken }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export type { Job };
