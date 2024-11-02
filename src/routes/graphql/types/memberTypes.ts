import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} from 'graphql';

const BASIC_MEMBER = 'BASIC';
const BUSINESS_MEMBER = 'BUSINESS';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: BASIC_MEMBER },
    BUSINESS: { value: BUSINESS_MEMBER },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
