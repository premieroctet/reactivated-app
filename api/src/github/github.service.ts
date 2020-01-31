import { Injectable, HttpService } from '@nestjs/common';

interface GithubRepoData {
  name: string;
  path: string;
  branch: string;
  token: string;
}

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getPackageJson(data: GithubRepoData) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.name}/contents/${data.path}package.json?ref=${data.branch}`,
        {
          headers: {
            Authorization: `token ${data.token}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        },
      )
      .toPromise();
  }

  async getYarnLock(data: GithubRepoData) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.name}/contents/${data.path}yarn.lock?ref=${data.branch}`,
        {
          headers: {
            Authorization: `token ${data.token}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        },
      )
      .toPromise();
  }
}
