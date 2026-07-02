import type {ShouldRevalidateFunction} from '@remix-run/react';
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from '@shopify/remix-oxygen';
import {
  isRouteErrorResponse,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';

import {Layout} from '~/components/layout/Layout';

import faviconAsset from '../public/favicon.ico';
import {CssVars} from './components/CssVars';
import {CustomAnalytics} from './components/CustomAnalytics';
import {Fonts} from './components/Fonts';
import {generateSanityImageUrl} from './components/sanity/SanityImage';
import {Button} from './components/ui/Button';
import {useLocalePath} from './hooks/useLocalePath';
import {useSanityThemeContent} from './hooks/useSanityThemeContent';
import {generateFontsPreloadLinks} from './lib/fonts';
import {resolveShopifyPromises} from './lib/resolveShopifyPromises';
import {seoPayload} from './lib/seo.server';
import {ROOT_QUERY} from './qroq/queries';
import tailwindCss from './styles/tailwind.css';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  formMethod,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {
      href: 'https://cdn.shopify.com',
      rel: 'preconnect',
    },
    {
      href: 'https://shop.app',
      rel: 'preconnect',
    },
    {href: tailwindCss, rel: 'stylesheet'},
  ];
}

export const meta: MetaFunction<typeof loader> = (loaderData) => {
  const {data} = loaderData;
  // Preload fonts files to avoid FOUT (flash of unstyled text)
  const fontsPreloadLinks = generateFontsPreloadLinks({
    fontsData: data?.sanityRoot.data?.fonts,
  });

  return [
    {
      // Preconnect to the Sanity CDN before loading fonts
      href: 'https://cdn.sanity.io',
      rel: 'preconnect',
      tagName: 'link',
    },
    ...generateFaviconUrls(data as SerializeFrom<typeof loader>),
    ...fontsPreloadLinks,
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {
    cart,
    customerAccount,
    env,
    locale,
    sanity,
    sanityPreviewMode,
    storefront,
  } = context;
  const language = locale?.language.toLowerCase();
  const isLoggedInPromise = customerAccount.isLoggedIn();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const rootData = Promise.all([
    sanity.query({
      groqdQuery: ROOT_QUERY,
      params: queryParams,
    }),
    storefront.query(`#graphql
      query layout {
        shop {
          id
        } 
      }
    `),
  ]);

  const [sanityRoot, layout] = await rootData;

  const seo = seoPayload.root({
    root: sanityRoot.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
    url: request.url,
  });

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: sanityRoot,
    request,
    storefront,
  });

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  return defer({
    cart: cartPromise,
    collectionListPromise,
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    env: {
      /*
       * Be careful not to expose any sensitive environment variables here.
       */
      NODE_ENV: env.NODE_ENV,
      PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
      PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
      SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
      SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
      SANITY_STUDIO_USE_PREVIEW_MODE: env.SANITY_STUDIO_USE_PREVIEW_MODE,
    },
    featuredCollectionPromise,
    featuredProductPromise,
    isLoggedIn: isLoggedInPromise,
    locale,
    sanityPreviewMode,
    sanityRoot,
    seo,
    shop: getShopAnalytics({
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      storefront: storefront,
    }),
  });
}

export default function App() {
  const nonce = useNonce();
  const {locale} = useRootLoaderData();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang={locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Fonts />
        <Links />
        <CssVars />
        <link rel="stylesheet" href="https://use.typekit.net/emc8zvi.css"></link>
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        <Analytics.Provider
          cart={data.cart}
          consent={data.consent}
          shop={data.shop}
        >
          <Layout>
            <Outlet />
          </Layout>
          <CustomAnalytics />
        </Analytics.Provider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

// export function ErrorBoundary() {
//   const nonce = useNonce();
//   const routeError = useRouteError();
//   const {locale} = useRootLoaderData();
//   const isRouteError = isRouteErrorResponse(routeError);
//   const {themeContent} = useSanityThemeContent();
//   const errorStatus = isRouteError ? routeError.status : 500;
//   const collectionsPath = useLocalePath({path: '/collections'});
//   const navigate = useNavigate();

//   let title = themeContent?.error?.serverError;
//   let pageType = 'page';

//   if (isRouteError) {
//     title = themeContent?.error?.pageNotFound;
//     if (errorStatus === 404) pageType = routeError.data || pageType;
//   }

//   return (
//     <html lang={locale.language.toLowerCase()}>
//       <head>
//         <meta charSet="utf-8" />
//         <meta content="width=device-width,initial-scale=1" name="viewport" />
//         <Meta />
//         <Fonts />
//         <Links />
//         <CssVars />
//       </head>
//       <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
//         <Layout>
//           <section>
//             <div className="container flex flex-col items-center justify-center py-20 text-center">
//               <span>{errorStatus}</span>
//               <h1 className="mt-5">{title}</h1>
//               {errorStatus === 404 ? (
//                 <Button asChild className="mt-6" variant="secondary">
//                   <Link to={collectionsPath}>
//                     {themeContent?.cart?.continueShopping}
//                   </Link>
//                 </Button>
//               ) : (
//                 <Button
//                   className="mt-6"
//                   onClick={() => navigate(0)}
//                   variant="secondary"
//                 >
//                   {themeContent?.error?.reloadPage}
//                 </Button>
//               )}
//             </div>
//           </section>
//         </Layout>
//         <ScrollRestoration nonce={nonce} />
//         <Scripts nonce={nonce} />
//         <LiveReload nonce={nonce} />
//       </body>
//     </html>
//   );
// }

export function ErrorBoundary() {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);
  const errorStatus = isRouteError ? routeError.status : 500;

  // Give the browser a lightweight, vanilla shell with NO heavy sub-components
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <title>Something went wrong</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans p-6 text-center">
        <main className="max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <span className="text-sm font-semibold uppercase tracking-wider text-red-500 bg-red-50 px-3 py-1 rounded-full">
            Error {errorStatus}
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            {isRouteError ? 'Page Not Found' : 'An unexpected error occurred'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We are having trouble loading this page right now.
          </p>
          <div className="mt-6">
            <a 
              href="/" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
            >
              Back to Homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

function generateFaviconUrls(loaderData: SerializeFrom<typeof loader>) {
  const {env, sanityRoot} = loaderData;
  const favicon = sanityRoot.data?.settings?.favicon;

  if (!favicon) {
    return [
      {
        href: faviconAsset,
        rel: 'icon',
        tagName: 'link',
        type: 'image/x-icon',
      },
    ];
  }

  const faviconUrl = generateSanityImageUrl({
    dataset: env.SANITY_STUDIO_DATASET,
    height: 32,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 32,
  });

  const appleTouchIconUrl = generateSanityImageUrl({
    dataset: env.SANITY_STUDIO_DATASET,
    height: 180,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 180,
  });

  return [
    {
      href: faviconUrl,
      rel: 'icon',
      tagName: 'link',
      type: 'image/x-icon',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon',
      tagName: 'link',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon-precomposed',
      tagName: 'link',
    },
  ];
}
