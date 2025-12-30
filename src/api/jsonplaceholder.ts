import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export interface JsonPost {
  id: number
  userId: number
  title: string
  body: string
}

export interface JsonComment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface JsonUser {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export const jsonPlaceholderApi = {
  // Posts
  async getPosts(): Promise<JsonPost[]> {
    const response = await axios.get<JsonPost[]>(`${BASE_URL}/posts`)
    return response.data
  },

  async getPost(id: number): Promise<JsonPost> {
    const response = await axios.get<JsonPost>(`${BASE_URL}/posts/${id}`)
    return response.data
  },

  async createPost(post: Omit<JsonPost, 'id'>): Promise<JsonPost> {
    const response = await axios.post<JsonPost>(`${BASE_URL}/posts`, post)
    return response.data
  },

  async updatePost(id: number, post: Partial<JsonPost>): Promise<JsonPost> {
    const response = await axios.put<JsonPost>(`${BASE_URL}/posts/${id}`, post)
    return response.data
  },

  async deletePost(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/posts/${id}`)
  },

  // Comments
  async getComments(postId: number): Promise<JsonComment[]> {
    const response = await axios.get<JsonComment[]>(`${BASE_URL}/posts/${postId}/comments`)
    return response.data
  },

  async createComment(comment: Omit<JsonComment, 'id'>): Promise<JsonComment> {
    const response = await axios.post<JsonComment>(`${BASE_URL}/comments`, comment)
    return response.data
  },

  // Users
  async getUsers(): Promise<JsonUser[]> {
    const response = await axios.get<JsonUser[]>(`${BASE_URL}/users`)
    return response.data
  },

  async getUser(id: number): Promise<JsonUser> {
    const response = await axios.get<JsonUser>(`${BASE_URL}/users/${id}`)
    return response.data
  },
}