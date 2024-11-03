import { GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { User } from './types/users.js';
import { Post } from './types/posts.js';
import { Profile } from './types/profiles.js';
import { UUIDType } from './types/uuid.js';
import {
  ChangePostDto,
  ChangeProfileDto,
  ChangeUserDto,
  CreatePostDto,
  CreateProfileDto,
  CreateUserDto,
} from './dto.js';
import {
  ChangePostInput,
  ChangeProfileInput,
  ChangeUserInput,
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
} from './inputTypes.js';

const prisma = new PrismaClient();

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: User,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_parent, { dto }: { dto: CreateUserDto }) => {
        const user = await prisma.user.create({
          data: dto,
        });
        return user;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }) => {
        await prisma.user.delete({
          where: { id },
        });
        return id;
      },
    },
    changeUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_parent, { id, dto }: { id: string; dto: ChangeUserDto }) => {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: dto,
        });
        return updatedUser;
      },
    },
    createPost: {
      type: Post,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_parent, { dto }: { dto: CreatePostDto }) => {
        const post = await prisma.post.create({
          data: dto,
        });
        return post;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }) => {
        await prisma.post.delete({
          where: { id },
        });
        return id;
      },
    },
    changePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_parent, { id, dto }: { id: string; dto: ChangePostDto }) => {
        const updatedPost = await prisma.post.update({
          where: { id },
          data: dto,
        });
        return updatedPost;
      },
    },
    createProfile: {
      type: Profile,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_parent, { dto }: { dto: CreateProfileDto }) => {
        const profile = await prisma.profile.create({
          data: dto,
        });
        return profile;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }) => {
        await prisma.profile.delete({
          where: { id },
        });
        return id;
      },
    },
    changeProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_parent, { id, dto }: { id: string; dto: ChangeProfileDto }) => {
        const updatedProfile = await prisma.profile.update({
          where: { id },
          data: dto,
        });
        return updatedProfile;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
      ) => {
        const existingSubscription = await prisma.subscribersOnAuthors.findUnique({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        if (existingSubscription) {
          throw new Error('Already subscribed to this user.');
        }
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });

        return authorId;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        return userId;
      },
    },
  },
});
