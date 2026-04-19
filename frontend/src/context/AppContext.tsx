// Global app state: a single source of truth for saved jobs + auth token
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Job {
  id: number;
  title: string;
  company_name: string;
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
  saveJob: (j: Job) => void;
  removeSavedJob: (id: number) => void;
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

  const saveJob = useCallback((job: Job) => {
    setSavedJobs(prev => prev.some(j => j.id === job.id) ? prev : [...prev, job]);
  }, []);

  const removeSavedJob = useCallback((id: number) => {
    setSavedJobs(prev => prev.filter(j => j.id !== id));
  }, []);

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
