export interface CreateUserDto {
  name: string;
  balance: number;
}

export interface ChangeUserDto {
  name: string;
  balance: number;
}

export interface CreatePostDto {
  authorId: string;
  title: string;
  content: string;
}

export interface ChangePostDto {
  title: string;
  content: string;
}

export interface CreateProfileDto {
  userId: string;
  memberTypeId: string;
  isMale: boolean;
  yearOfBirth: number;
}

export interface ChangeProfileDto {
  userId: string;
  memberTypeId: string;
  isMale: boolean;
  yearOfBirth: number;
}
