export interface PostReply {
  author: string;
  profilePicUrl: string;
  text: string;
  timestamp: Date;
}

export interface PostComment {
  author: string;
  profilePicUrl: string;
  text: string;
  timestamp: Date;
  likes?: number;              
  replies?: PostReply[]; 
  likedBy?: string[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  profilePicUrl?: string;
  tags: string[];
  timestamp: Date;
  views?: number;
  upvotes?: number;
  comments?: PostComment[];  // Use the renamed interface here
  likedBy?: string[];
  viewTimestamps?: Date[];
  isAnnouncement?: boolean; 
}

export interface User {
  email: string;
  fullName: string;
  password: string;
  profilePicUrl?: string;
  role: 'admin' | 'user';
}
