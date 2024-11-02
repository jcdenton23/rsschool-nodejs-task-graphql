import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { RootQuery } from './rootQuery.js';
import { Mutation } from './mutations.js';

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      try {
        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: { prisma },
        });
        return { data: result.data, errors: result.errors || null };
      } catch (error) {
        fastify.log.error(error);
        return { errors: [{ message: 'Internal server error' }] };
      }
    },
  });
};

export default plugin;
