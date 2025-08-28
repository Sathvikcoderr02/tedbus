import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../services/community.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-community-feed',
  templateUrl: './community-feed.component.html',
  styleUrls: ['./community-feed.component.css']
})
export class CommunityFeedComponent implements OnInit {
  posts: any[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';

  // Add Array to the component to make it available in the template
  Array = Array;

  constructor(
    private communityService: CommunityService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(page: number = 1): void {
    this.loading = true;
    this.communityService.getPosts(page, 10, undefined, this.searchQuery).subscribe(
      (response: any) => {
        this.posts = response.posts || [];
        this.currentPage = response.currentPage || 1;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    );
  }

  onSearch(): void {
    this.loadPosts(1);
  }

  onPageChange(page: number): void {
    this.loadPosts(page);
  }
}
