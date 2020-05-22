import { HttpService, Injectable } from '@nestjs/common';

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
    githubToken: string;
    fullName: string;
    branch: string;
    updatedDependencies: string[];
  }) {
    return this.httpService
      .post(`https://api.github.com/repos/${data.fullName}/pulls`, {
        headers: {
          Authorization: `token ${data.githubToken}`,
          Accept: 'application/vnd.github.machine-man-preview+json',
        },
        data: {
          title: `Upgrade ${data.updatedDependencies.join(' ')}`,
          body: 'Please pull these awesome changes in!',
          head: 'myPRBranch',
          base: data.branch,
        },
      })
      .toPromise()
      .catch(e => {
        console.warn(e.response.config);
      });
  }

  // https://developer.github.com/v3/git/refs/#create-a-reference
  async createBranch(data: {
    fullName: string;
    refName: string;
    githubToken: string;
  }) {
    const revisionHashRes = await this.httpService
      .get(`https://api.github.com/repos/${data.fullName}/git/refs/heads`, {
        headers: {
          Authorization: `token ${data.githubToken}`,
        },
      })
      .toPromise();
    const masterSHA = revisionHashRes.data[0].object.sha;

    const createRefRes = await this.httpService
      .post(`https://api.github.com/repos/${data.fullName}/git/refs`, {
        headers: {
          Authorization: `token ${data.githubToken}`,
        },
        data: {
          ref: 'refs/heads/' + data.refName,
          sha: masterSHA,
        },
      })
      .toPromise()
      .catch(e => {
        console.log(e.response.config);
        console.log(e.response.data);
      });
  }

  // async createCommit(data: { fullName: string; token: string }) {
  //   return this.httpService.post(
  //     `https://api.github.com/repos/${data.fullName}/git/commits`,
  //     {
  //       headers: {
  //         Authorization: `token ${data.token}`,
  //         Accept: 'application/vnd.github.machine-man-preview+json',
  //       },
  //       data: {
  //         message: 'my commit message',
  //         tree: '827efc6d56897b048c772eb4087f854f46256132',
  //       },
  //     },
  //   );
  // }
}
