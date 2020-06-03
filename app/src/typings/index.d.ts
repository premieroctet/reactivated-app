interface JwTokenData {
  githubToken: string;
  githubId: string;
  userName: string;
  userId: User['id'];
}

interface User {
  id: number;
  username: string;
  githubId: string;
  githubToken: string;
}
