import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, validate, parse, DocumentNode } from 'graphql';
import depthLimit from 'graphql-depth-limit';
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
      const { query, variables } = req.body as {
        query: string;
        variables?: Record<string, unknown>;
      };
      let parsedQuery: DocumentNode;
      try {
        parsedQuery = parse(query);
      } catch (error) {
        return { errors: [{ message: 'Invalid query syntax' }] };
      }

      const validationErrors = validate(schema, parsedQuery, [depthLimit(5)]);
      if (validationErrors.length > 0) {
        return { errors: validationErrors.map((err) => ({ message: err.message })) };
      }

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
