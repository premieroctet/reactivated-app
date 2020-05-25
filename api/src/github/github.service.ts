import { HttpService, Injectable, Logger } from '@nestjs/common';

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
  private readonly logger = new Logger(GithubService.name);

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
    branchName: string;
    githubToken: string;
  }): Promise<any> {
    const branchesRes = await this.httpService
      .get(`https://api.github.com/repos/${data.fullName}/git/refs/heads`, {
        headers: {
          Authorization: `token ${data.githubToken}`,
        },
      })
      .toPromise();
    const masterSHA = branchesRes.data[0].object.sha;

    // const newTreeRes = await this.httpService
    //   .post(`https://api.github.com/repos/${data.fullName}/git/trees`, {
    //     headers: {
    //       Authorization: `token ${data.githubToken}`,
    //     },
    //     data: {
    //       base_tree: masterSHA,
    //       // base_tree: treeSha,
    //       tree: {
    //         path: 'package.json',
    //         mode: '100644',
    //         type: 'blob',
    //         content: 'my content',
    //       },
    //     },
    //   })
    //   .toPromise()
    //   .catch(e => {
    //     console.log('e', e.response.data);
    //   });
    // console.log('newTreeRes', newTreeRes);

    return await this.httpService
      .post(
        `https://api.github.com/repos/${data.fullName}/git/refs`,
        {
          ref: 'refs/heads/' + data.branchName,
          sha: masterSHA,
        },
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
          },
        },
      )
      .toPromise();
  }

  // https://developer.github.com/v3/git/refs/#get-a-single-reference
  async getSingleRef(data: {
    fullName: string;
    branchName: string;
    token: string;
  }) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.fullName}/git/ref/heads/${data.branchName}`,
        {
          headers: {
            Authorization: `token ${data.token}`,
          },
        },
      )
      .toPromise();
  }

  async commitFile(data: {
    message: string;
    content: string;

    name: string;
    path: string;
    branch: string;
    token: string;
    fileName: string;
  }) {
    let fileSHA = null;
    try {
      const fileRes = await this.getFile(data);
      fileSHA = fileRes.data.sha;
    } catch (error) {}

    const updatedFileRes = await this.httpService
      .put(
        `https://api.github.com/repos/${data.name}/contents/${data.fileName}?ref=${data.branch}`,
        {
          message: data.message,
          content: data.content,
          sha: fileSHA ? fileSHA : '',
        },
        {
          headers: {
            Authorization: `token ${data.token}`,
          },
        },
      )
      .toPromise()
      .catch(e => {
        // console.warn(e.response.config);
        // console.warn(e.response.data);
      });
    console.log('GithubService -> updatedFile', updatedFileRes);
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
