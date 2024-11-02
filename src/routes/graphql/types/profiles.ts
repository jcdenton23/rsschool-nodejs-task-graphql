import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './memberTypes.js';
import { Context } from '../interfaces.js';

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (
        { memberTypeId }: { memberTypeId: string },
        _args,
        context: Context,
      ) => {
        return context.loaders.memberType.load(memberTypeId);
      },
    },
  },
});
