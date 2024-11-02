import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { User } from './types/users.js';
import { MemberType, MemberTypeId } from './types/memberTypes.js';
import { Post } from './types/posts.js';
import { Profile } from './types/profiles.js';
import { UUIDType } from './types/uuid.js';
import { Context } from './interfaces.js';

export const RootQuery = new GraphQLObjectType({
  name: 'rootQuery',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(Profile)),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.prisma.profile.findUnique({ where: { id } });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.prisma.memberType.findUnique({ where: { id } });
      },
    },
  },
});
