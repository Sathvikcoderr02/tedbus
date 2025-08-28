import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  tags: string[] = [];
  tagInput = '';

  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      tags: [''],
      isPublic: [true]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < Math.min(files.length, 5 - this.previewUrls.length); i++) {
        const file = files[i];
        if (file.type.match('image.*')) {
          this.selectedFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewUrls.push(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          this.toastr.warning('Only image files are allowed.');
        }
      }
    }
  }

  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  addTag(event: any): void {
    if (event.key === 'Enter' && this.tagInput.trim()) {
      const tag = this.tagInput.trim().toLowerCase();
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        this.tagInput = '';
      }
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    
    // Add form data
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('content', this.postForm.get('content')?.value);
    formData.append('location', this.postForm.get('location')?.value);
    formData.append('isPublic', this.postForm.get('isPublic')?.value);
    
    // Add tags
    this.tags.forEach(tag => {
      formData.append('tags[]', tag);
    });
    
    // Add images
    this.selectedFiles.forEach((file, index) => {
      formData.append('images', file, file.name);
    });

    this.communityService.createPost(formData).subscribe({
      next: (response) => {
        this.toastr.success('Post created successfully!');
        this.router.navigate(['/community']);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.toastr.error('Failed to create post. Please try again.');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  get f() {
    return this.postForm.controls;
  }
}
