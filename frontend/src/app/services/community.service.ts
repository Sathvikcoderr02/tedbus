import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/community';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      // 'Authorization' header will be added in the auth interceptor
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Get all posts with pagination
  getPosts(page: number = 1, limit: number = 10, tag?: string, search?: string): Observable<any> {
    let url = `${API_URL}/posts?page=${page}&limit=${limit}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    return this.http.get(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Get a single post by ID
  getPost(id: string): Observable<any> {
    return this.http.get(`${API_URL}/posts/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new post
  createPost(postData: FormData): Observable<any> {
    // Don't set Content-Type header for FormData - let the browser set it with the correct boundary
    const options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        // 'Authorization' header will be added in the auth interceptor
      })
    };
    
    return this.http.post(`${API_URL}/posts`, postData, options).pipe(
      catchError(this.handleError)
    );
  }

  // Add a comment to a post
  addComment(postId: string, content: string): Observable<any> {
    return this.http.post(
      `${API_URL}/posts/${postId}/comments`, 
      { content },
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Toggle like on a post
  toggleLike(postId: string): Observable<any> {
    return this.http.post(
      `${API_URL}/posts/${postId}/like`, 
      {},
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a post
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${API_URL}/posts/${postId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Upload an image
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post(`${API_URL}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
