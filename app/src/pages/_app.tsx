import { getApolloClient } from '@/clients/apollo';
import { queryClient } from '@/clients/query';
import { ApolloProvider } from '@apollo/client';
import App, { AppContext, AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={getApolloClient(false)}>
        <Component {...pageProps} />
      </ApolloProvider>
    </QueryClientProvider>
  );
}

// To disable static generation of the _document.tsx we need to add getInitialProps to the App
// According to: https://github.com/vercel/next.js/issues/7791
MyApp.getInitialProps = async (ctx: AppContext) => {
  const props = await App.getInitialProps(ctx);

  return props;
}