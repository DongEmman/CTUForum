import { Injectable } from '@angular/core';
import { Post, PostComment, PostReply } from '../models/post.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];

  getPosts(): Post[] {
    return [...this.posts]; // return a copy
  }

  addPost(post: Post): void {
    post.id = this.posts.length + 1;
    post.timestamp = new Date();
    this.posts.unshift(post); // add to top
  }

  deletePost(id: number): void {
    this.posts = this.posts.filter(p => p.id !== id);
  }

  incrementView(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.views = (post.views || 0) + 1;
      if (!post.viewTimestamps) post.viewTimestamps = [];
      post.viewTimestamps.push(new Date());
    }
  }


 upvote(postId: number, currentUser: string) {
  const post = this.posts.find(p => p.id === postId);
  if (post) {
    post.likedBy = post.likedBy || [];

    const index = post.likedBy.indexOf(currentUser);

    if (index === -1) {
      // ✅ Not yet liked, add like
      post.upvotes = (post.upvotes || 0) + 1;
      post.likedBy.push(currentUser);
    } else {
      // ✅ Already liked, remove like
      post.upvotes = Math.max((post.upvotes || 1) - 1, 0);
      post.likedBy.splice(index, 1);
    }
  }
}

  addComment(postId: number, comment: PostComment) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.comments = post.comments || [];
      post.comments.push(comment); // ✅ use variable, not class name
    }
  }

likeComment(postId: number, commentIndex: number, user: string) {
  const post = this.posts.find(p => p.id === postId);
  if (!post) return;

  const comment = post.comments?.[commentIndex];
  if (!comment) return;

  comment.likedBy = comment.likedBy || [];

  if (comment.likedBy.includes(user)) {
    comment.likes = (comment.likes || 1) - 1;
    comment.likedBy = comment.likedBy.filter(u => u !== user);
  } else {
    comment.likes = (comment.likes || 0) + 1;
    comment.likedBy.push(user);
  }
}

  addReply(postId: number, commentIdx: number, reply: PostReply) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    const c = post.comments![commentIdx];
    c.replies = c.replies || [];
    c.replies.push(reply);
  }
}



