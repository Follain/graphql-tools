import { makeExecutableSchema } from './schemaGenerator';
import { mockServer } from './mock';
import graphQLHTTP from 'express-graphql';


export default function apolloServer({
  schema, // required
  resolvers, // required if mocks is not false
  connectors, // required if mocks is not false
  logger,
  mocks = false,
  allowUndefinedInResolve = false,
  formatError, // pass through
  graphiql = true, // pass through
  validationRules, // pass through
  context, // pass through
  rootValue, // pass through
}) {
  if (!schema) {
    throw new Error('schema is required');
  }
  if (!logger) {
    // eslint-disable-next-line no-param-reassign
    logger = { log: (x) => console.log(x) };
  }
  if (!context) {
    // eslint-disable-next-line no-param-reassign
    context = {};
  }
  let executableSchema;
  if (mocks) {
    const myMocks = mocks || {};
    executableSchema = mockServer(schema, myMocks);
  } else {
    // TODO allow passing in a fully executable GraphQL schema,
    // in which case resolvers and connectors is not required.
    
    // this is just basics, makeExecutableSchema should catch the rest
    if (!resolvers) {
      throw new Error('resolvers is required option if mocks is not provided');
    }
    if (!connectors) {
      throw new Error('connectors is a required option if mocks is not provided');
    }
    executableSchema = makeExecutableSchema({
      schema,
      resolvers,
      connectors,
      logger,
      allowUndefinedInResolve,
    });
  }

  return (req, res, next) => {
    return graphQLHTTP({
      schema: executableSchema,
      context,
      formatError,
      rootValue,
      validationRules,
      graphiql,
    })(req, res, next);
  };
}

export { apolloServer };