import { getApolloClient } from '@/clients/apollo';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class DocumentWithApollo extends Document {
  constructor(props: any) {
    super(props);

    const { __NEXT_DATA__, apolloState } = props;
    __NEXT_DATA__.apolloState = apolloState;
  }

  static async getInitialProps(ctx: DocumentContext) {
    /**
     * Initialize and get a reference to ApolloClient, which is saved in a "global" variable.
     * The same client instance is returned to any other call to `getApolloClient`, so _app.js gets the same authenticated client to give to ApolloProvider.
     */
    const apolloClient = getApolloClient(true, ctx);

    /**
     * Render the page through Apollo's `getDataFromTree` so the cache is populated.
     * Unfortunately this renders the page twice per request... There may be a way around doing this, but I haven't quite ironed that out yet.
     */
    await renderToStringWithData(<ctx.AppTree pageProps={{}}/>);

    /**
     * Extract the cache to pass along to the client so the queries are "hydrated" and don't need to actually request the data again!
     */
    const apolloState = apolloClient.extract();
    
    /**
     * Render the page as normal, but now that ApolloClient is initialized and the cache is full, each query will actually work.
     */
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, apolloState };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default DocumentWithApollo;
