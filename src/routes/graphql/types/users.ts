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
import { Context } from '../interfaces.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: Profile,
      resolve: async ({ id }: { id: string }, _args, context: Context) => {
        return context.loaders.profileByUser.load(id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async ({ id }, _args, context: Context) => {
        return context.loaders.postsByUser.load(id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async ({ id }, _args, context: Context) => {
        return context.loaders.userSubscribedTo.load(id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async ({ id }, _args, context: Context) => {
        return context.loaders.subscribedToUser.load(id);
      },
    },
  }),
});

export const User = UserType;
