import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityFeedComponent } from './community-feed/community-feed.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent },
  { 
    path: 'create', 
    component: CreatePostComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: ':id', 
    component: PostDetailComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
