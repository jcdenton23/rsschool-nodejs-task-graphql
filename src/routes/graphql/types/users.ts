import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profiles.js';
import { Post } from './posts.js';
import { PrismaClient } from '@prisma/client';
import { Context } from '../interfaces.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (parent: { id: string }, _args, { prisma }: Context) =>
        await prisma.profile.findUnique({ where: { userId: parent.id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (parent, _args, { prisma }) =>
        await prisma.post.findMany({ where: { authorId: parent.id } }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _args, { prisma }) =>
        await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _args, { prisma }) =>
        await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        }),
    },
  }),
});

export const User = UserType;
