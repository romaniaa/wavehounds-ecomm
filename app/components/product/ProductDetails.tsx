import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {ADD_TO_CART_BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';

import type {PriceBlockProps} from '../blocks/PriceBlock';
import type {ShopifyDescriptionBlockProps} from '../blocks/ShopifyDescriptionBlock';
import type {ShopifyTitleBlockProps} from '../blocks/ShopifyTitleBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';
import type {FeaturedProductSectionProps} from '../sections/FeaturedProductSection';
import type {ProductInformationSectionProps} from '../sections/ProductInformationSection';

import {PriceBlock} from '../blocks/PriceBlock';
import {ShopifyDescriptionBlock} from '../blocks/ShopifyDescriptionBlock';
import {ShopifyTitleBlock} from '../blocks/ShopifyTitleBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';
import {ProductForm} from './ProductForm';
import {Link} from '@remix-run/react';

export function ProductDetails({
  data,
}: {
  data: FeaturedProductSectionProps | ProductInformationSectionProps;
}) {
  const Components = useMemo(
    () => ({
      marks: {
        externalLink: (props: {
          children: React.ReactNode;
          value: ExternalLinkAnnotationProps;
        }) => {
          return (
            <ExternalLinkAnnotation {...props.value}>
              {props.children}
            </ExternalLinkAnnotation>
          );
        },
        internalLink: (props: {
          children: React.ReactNode;
          value: InternalLinkAnnotationProps;
        }) => {
          return (
            <InternalLinkAnnotation {...props.value}>
              {props.children}
            </InternalLinkAnnotation>
          );
        },
      },
      types: {
        addToCartButton: (props: {
          value: TypeFromSelection<typeof ADD_TO_CART_BUTTON_BLOCK_FRAGMENT>;
        }) => <ProductForm {...props.value} />,
        price: (props: {value: PriceBlockProps}) => (
          <PriceBlock {...props.value} />
        ),
        shopifyDescription: (props: {value: ShopifyDescriptionBlockProps}) => (
          <ShopifyDescriptionBlock {...props.value} />
        ),
        shopifyTitle: (props: {value: ShopifyTitleBlockProps}) => (
          <ShopifyTitleBlock {...props.value} />
        ),
      },
    }),
    [],
  );
  
  return (
    <div className="container space-y-4 lg:max-w-none lg:px-0 h-full w-full flex flex-col justify-center">
      {data._type === "featuredProductSection" && data.product?.store && (
        <div className="flex flex-row justify-between items-start w-full">
          <h2 className="lg:text-8xl text-xl">{data.product.store.title}</h2>
          <div className="text-3xl">${data.product.store.firstVariant?.store.price}</div>
        </div>

      )}
      {data.richtext && (
        <div className="w-full">
          <PortableText
            components={Components as PortableTextComponents}
            value={data.richtext as PortableTextBlock[]}
          />
        </div>
      )}
       {data._type === "featuredProductSection" && data.product?.store.firstVariant && (
        <div className="w-full mt-4">
          <ProductForm _key={''} _type={'addToCartButton'} quantitySelector={null} shopPayButton={null} {...data.product?.store.firstVariant.store} />
        </div>
      )}
      {data._type === "featuredProductSection" && data.product?.store.title && (
        <Link to={`/products/${data.product?.store.title.toLowerCase().replace(/ /g,'-')}`}>
          {`see more`}
        </Link>
      )}
    </div>
  );
}
