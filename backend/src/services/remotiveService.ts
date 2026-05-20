import { unifiedConfig } from '../config/unifiedConfig';

export class RemotiveService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = unifiedConfig.REMOTIVE_API_BASE;
  }

  async getJobs(limit = 50, search?: string) {
    let url = `${this.baseUrl}?limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Remotive API responded with status: ${response.status}`);
    }
    const data: any = await response.json();
    return data.jobs || [];
  }
}
