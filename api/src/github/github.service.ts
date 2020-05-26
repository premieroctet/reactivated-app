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

  // https://developer.github.com/v3/repos/contents/#get-contents
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

  // https://developer.github.com/v3/git/blobs/#get-a-blob
  async getBlob(data: { name: string; fileSHA: string; token: string }) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.name}/git/blobs/${data.fileSHA}`,
        {
          headers: {
            Authorization: `token ${data.token}`,
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
    baseBranch: string;
    headBranch: string;
    updatedDependencies: string[];
  }) {
    return this.httpService
      .post(
        `https://api.github.com/repos/${data.fullName}/pulls`,
        {
          title: `Upgrade ${data.updatedDependencies.join(' ')}`,
          body: 'Please pull these awesome changes in!',
          head: data.headBranch,
          base: data.baseBranch,
        },
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        },
      )
      .toPromise()
      .catch(e => {
        console.log('create PR', e.response.data);
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
      .toPromise()
      .catch(e => {
        console.log('createBranch', e.response.data);
      });
  }

  // https://developer.github.com/v3/repos/contents/#create-or-update-a-file
  async commitFile(data: {
    message: string;
    content: string;
    name: string;
    path: string;
    branch: string;
    token: string;
    fileName: string;
  }) {
    let sha = '';
    try {
      // If existing file
      const fileRes = await this.getFile(data);
      const fileSHA = fileRes.data.sha;
      const fileBlobRes = await this.getBlob({
        fileSHA,
        name: data.name,
        token: data.token,
      });
      sha = fileBlobRes.data.sha;
    } catch (error) {
      // No existing file
      this.logger.debug('File not found : ' + data.fileName);
    }
    return this.httpService
      .put(
        `https://api.github.com/repos/${data.name}/contents${
          data.path === '/' ? data.path : '/' + data.path
        }${data.fileName}`,
        {
          message: data.message,
          content: data.content,
          branch: data.branch,
          sha,
        },
        {
          headers: {
            Authorization: `token ${data.token}`,
          },
        },
      )
      .toPromise()
      .catch(e => {
        console.log('commitFile', e.response.data);
      });
  }
}
