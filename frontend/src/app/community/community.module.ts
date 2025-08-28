import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { CommunityFeedComponent } from './community-feed/community-feed.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostCardComponent } from './post-card/post-card.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CommunityComponent,
    CommunityFeedComponent,
    CreatePostComponent,
    PostDetailComponent,
    PostCardComponent,
    CommentSectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommunityRoutingModule,
    SharedModule
  ]
})
export class CommunityModule { }
