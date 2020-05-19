import { Injectable, HttpService } from '@nestjs/common';
import { UpdateDateColumn } from 'typeorm';

interface IDependenciesData {
  name: string;
  path: string;
  branch: string;
  token: string;
  fileName: string;
}

interface IRepoData {
  fullName: string;
  token: string;
}

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getFile(data: IDependenciesData) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.name}/contents/${data.path}${data.fileName}?ref=${data.branch}`,
        {
          headers: {
            Authorization: `token ${data.token}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        },
      )
      .toPromise();
  }

  async getRepository(data: IRepoData) {
    return this.httpService
      .get(`https://api.github.com/repos/${data.fullName}`, {
        headers: {
          Authorization: `token ${data.token}`,
          Accept: 'application/vnd.github.machine-man-preview+json',
        },
      })
      .toPromise();
  }

  async createPullRequest(data: {
    token: string;
    fullName: string;
    branch: string;
    updatedDependencies: string[];
  }) {
    return this.httpService
      .post(`https://api.github.com/repos/${data.fullName}/pulls`, {
        headers: {
          Authorization: `token ${data.token}`,
          Accept: 'application/vnd.github.machine-man-preview+json',
        },
        body: {
          // title: `Upgrade ${data.updatedDependencies.join(' ')}`,
          title: `Upgrade`,
          body: 'Please pull these awesome changes in!',
          head: 'octocat:new-feature',
          base: data.branch,
        },
      })
      .toPromise();
  }
}
