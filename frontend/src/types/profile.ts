export interface Profile {
  id: string;
  name: string;
  email: string;
  profile: {
    id: string;
    age: number | null;
    interests: string[];
  } | null;
}

export interface UpdateProfileData {
  name?: string;
  age?: number | null;
  interests?: string[] | string;
}
