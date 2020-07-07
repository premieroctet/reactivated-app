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
export interface ITreeData {
  path: string;
  mode: string;
  type: string;
  content: string;
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

  // https://developer.github.com/v3/pulls/#create-a-pull-request
  async createPullRequest(data: {
    githubToken: string;
    fullName: string;
    baseBranch: string;
    headBranch: string;
    updatedDependencies: string[];
    upgradedDiff: object;
  }) {
    const formatUpgrade = (dep: string) => {
      let lastIdx = dep.lastIndexOf('@');
      if (lastIdx === -1) {
        lastIdx = dep.length;
      }
      const depName = dep.slice(0, lastIdx);

      return `#### ${dep}<br />
${'```diff'}
${data.upgradedDiff[depName] ? data.upgradedDiff[depName].join('\n') : ''}
${'```'}
  
  
  `;
    };

    let updateDeps = '';
    for (const dep of data.updatedDependencies) {
      updateDeps += formatUpgrade(dep);
    }
    const bodyTemplate = `## 🔌 Reactivated App Update<br/>
✨ Your app has been reactivated!<br/>
### Dependencies updated<br/>
${updateDeps}
`;

    return this.httpService
      .post(
        `https://api.github.com/repos/${data.fullName}/pulls`,
        {
          title: `Reactivated App update (${
            data.updatedDependencies.length
          } dependenc${data.updatedDependencies.length > 1 ? 'ies' : 'y'})`,
          body: bodyTemplate,
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
      .toPromise();
  }

  // https://developer.github.com/v3/git/refs/#create-a-reference
  async createBranch(data: {
    fullName: string;
    branchName: string;
    githubToken: string;
    baseBranch: string;
  }): Promise<any> {
    const branchesRes = await this.httpService
      .get(`https://api.github.com/repos/${data.fullName}/git/refs/heads`, {
        headers: {
          Authorization: `token ${data.githubToken}`,
        },
      })
      .toPromise();
    const originalBranch = branchesRes.data.find(
      branch => branch.ref === `refs/heads/${data.baseBranch}`,
    );
    const baseSHA = originalBranch.object.sha;

    return await this.httpService
      .post(
        `https://api.github.com/repos/${data.fullName}/git/refs`,
        {
          ref: 'refs/heads/' + data.branchName,
          sha: baseSHA,
        },
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
          },
        },
      )
      .toPromise();
  }

  // https://developer.github.com/v3/git/commits/#get-a-commit
  async getCommit(data: {
    fullName: string;
    githubToken: string;
    commitSHA: string;
  }) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.fullName}/git/commits/${data.commitSHA}`,
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
          },
        },
      )
      .toPromise();
  }

  // https://developer.github.com/v3/git/commits/#create-a-commit
  async createCommit(data: {
    fullName: string;
    githubToken: string;
    message: string;
    tree: string;
    parents: string[];
  }) {
    return this.httpService
      .post(
        `https://api.github.com/repos/${data.fullName}/git/commits`,
        {
          message: data.message,
          tree: data.tree,
          parents: data.parents,
        },
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
            Accept: 'application/vnd.github.v3.diff',
          },
        },
      )
      .toPromise();
  }

  async updateBranch(data: {
    sha: string;
    githubToken: string;
    branchName: string;
    fullName: string;
  }) {
    return this.httpService
      .patch(
        `https://api.github.com/repos/${data.fullName}/git/refs/heads/${data.branchName}`,
        {
          sha: data.sha,
        },
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
          },
        },
      )
      .toPromise();
  }

  async getDiffUrl(data: { name: string; token: string; commitSHA: string }) {
    return this.httpService
      .get(
        `https://api.github.com/repos/${data.name}/commits/${data.commitSHA}`,
        {
          headers: {
            Authorization: `token ${data.token}`,
            Accept: 'application/vnd.github.v3.diff',
          },
        },
      )
      .toPromise();
  }

  async createTree(data: {
    fullName: string;
    githubToken: string;
    base_tree: string;
    tree: ITreeData[];
  }) {
    console.log('data', data);
    return this.httpService
      .post(
        `https://api.github.com/repos/${data.fullName}/git/trees`,
        {
          tree: data.tree,
          base_tree: data.base_tree,
        },
        {
          headers: {
            Authorization: `token ${data.githubToken}`,
          },
        },
      )
      .toPromise();
  }
}
