import { NextPage } from 'next';
import { useMutation } from 'react-query';
import styles from './auth-page.module.css';
import { getApolloContext, gql, useApolloClient, useQuery } from '@apollo/client';
import { useContext } from 'react';

const GET_ITEMS_QUERY = gql`
  query GetItems {
    items {
      id
      name
    }
  }
`

export const AuthPage: NextPage = () => {
  const apolloClient = useApolloClient();

  const itemsQuery = useQuery<{items: {id: string, name: string}[]}>(GET_ITEMS_QUERY)
  const loginMutation = useMutation(
    () => fetch('/api/login', { method: 'POST' }),
    {
      onSuccess: () => {
        apolloClient.refetchQueries({
          include: [GET_ITEMS_QUERY]
        });
      },
    }
  );
  const logoutMutation = useMutation(
    () => fetch('/api/logout', { method: 'POST' }),
    {
      onSuccess: () => {
        apolloClient.refetchQueries({
          include: [GET_ITEMS_QUERY]
        });
      },
    }
  );

  const context = useContext(getApolloContext());

  return <div className={styles.root}>
    <div className={styles.buttons}>
      <button onClick={() => loginMutation.mutateAsync()} disabled={itemsQuery.loading || (!itemsQuery.loading && !itemsQuery.error)}>Login</button>
      <button onClick={() => logoutMutation.mutateAsync()} disabled={itemsQuery.loading || (!itemsQuery.loading && !!itemsQuery.error)}>Logout</button>
    </div>
    <div>
      {itemsQuery.loading && <span>Loading...</span>}
      {!itemsQuery.loading && !itemsQuery.data && <span>No data</span>}
      {!itemsQuery.loading && !!itemsQuery.data && itemsQuery.error && <span>{itemsQuery.error.message}</span>}
      {!itemsQuery.loading && !!itemsQuery.data && !itemsQuery.error && (
        <ul>
          {itemsQuery.data.items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  </div>;
};
