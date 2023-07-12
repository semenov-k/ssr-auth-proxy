import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from '@apollo/client';
import { NextPageContext } from 'next';

export const isServer = typeof window === 'undefined';
const windowApolloState =
  !isServer && (window.__NEXT_DATA__ as any).apolloState;

let client: ApolloClient<NormalizedCacheObject>;

export function getApolloClient(forceNew: boolean, ctx?: NextPageContext) {
  const enhancedFetch = (url: string, init: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Cookie: ctx?.req?.headers.cookie as string,
      },
    }).then((response) => response);

  if (!client || forceNew) {
    client = new ApolloClient({
      ssrMode: Boolean(ctx),
      link: new HttpLink({
        uri: 'http://localhost:3001/api/graphql',
        credentials: 'same-origin',
        fetch: ctx ? enhancedFetch : fetch,
      }),
      cache: new InMemoryCache().restore(windowApolloState || {}),
    });

    (client as any).cookie = ctx?.req?.headers.cookie;
  }

  return client;
}
