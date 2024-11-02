import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { User } from './types/users.js';
import { MemberType, MemberTypeId } from './types/memberTypes.js';
import { Post } from './types/posts.js';
import { Profile } from './types/profiles.js';
import { UUIDType } from './types/uuid.js';
import { Context } from './interfaces.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const RootQuery = new GraphQLObjectType({
  name: 'rootQuery',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: async (_source, _args, context: Context, info) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(parsedInfo, User);

        const includeRelations = {
          subscribedToUser: !!fields['subscribedToUser'],
          userSubscribedTo: !!fields['userSubscribedTo'],
        };

        const users = await context.prisma.user.findMany({
          include: includeRelations,
        });

        users.forEach((user) => {
          if (includeRelations.subscribedToUser) {
            const subscribers = users.filter((u) =>
              u.subscribedToUser.some((sub) => sub.subscriberId === user.id),
            );
            context.loaders.subscribedToUser.prime(user.id, subscribers);
          }

          if (includeRelations.userSubscribedTo) {
            const authors = users.filter((u) =>
              u.userSubscribedTo.some((sub) => sub.authorId === user.id),
            );
            context.loaders.userSubscribedTo.prime(user.id, authors);
          }
        });

        return users;
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.loaders.user.load(id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: async (_parent, _args, context: Context) => {
        const posts = await context.prisma.post.findMany({});
        posts.forEach((post) => context.loaders.post.prime(post.id, post));

        return posts;
      },
    },
    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.loaders.post.load(id);
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(Profile)),
      resolve: async (_parent, _args, context: Context) => {
        const profiles = await context.prisma.profile.findMany({});
        profiles.forEach((profile) => context.loaders.profile.prime(profile.id, profile));

        return profiles;
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.loaders.profile.load(id);
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
        return context.loaders.memberType.load(id);
      },
    },
  },
});
