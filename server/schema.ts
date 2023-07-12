import {GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import { items } from './data';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      items: {
        resolve: () => items,
        type: new GraphQLList(new GraphQLObjectType({
          name: 'item',
          fields: {
            id: {
              type: GraphQLString,
              resolve: (source) => source.id
            },
            name: {
              type: GraphQLString,
              resolve: (source) => source.name
            }
          }
        }))
      }
    }
  })
});