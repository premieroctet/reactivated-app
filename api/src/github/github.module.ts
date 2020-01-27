import { Module, HttpModule } from '@nestjs/common';
import { GithubService } from './github.service';

@Module({
  imports: [HttpModule],
  exports: [GithubService],
  providers: [GithubService],
})
export class GithubModule {}
