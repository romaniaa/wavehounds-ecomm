import React, {useEffect, useState, useMemo} from 'react';
import type {TypeFromSelection} from 'groqd';

import {useSection} from '../CmsSection';
import type {INSTAGRAM_FEED_SECTION_FRAGMENT} from '~/qroq/sections';
import { SanityImage } from '../sanity/SanityImage';

import {cn} from '~/lib/utils';

type InstagramFeedSectionProps = TypeFromSelection<
  typeof INSTAGRAM_FEED_SECTION_FRAGMENT
>;

type InstagramPost = {
  id: string;
  media_url: string;
  permalink: string;
};

export function InstagramFeedSection({
  data,
}: {data: InstagramFeedSectionProps}) {
  const {title, initialAccessToken, numImages, numColumns} = data;

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_url,permalink&access_token=${initialAccessToken}&limit=${numImages}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts.');
        }
        const json = await response.json();
        setPosts(json.data || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchInstagramPosts();
  }, [initialAccessToken, numImages]);

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  return (
    <div>
      <div className="container">
        {title && <h2 className="mb-4 text-xl lg:text-8xl font-bold">{title}</h2>}
        <div
          className={cn(
            'grid gap-4 grid-cols-2',
            numColumns === 1 && 'grid-cols-1',
            numColumns === 2 && 'grid-cols-2',
            numColumns === 3 && 'lg:grid-cols-3',
            numColumns === 4 && 'lg:grid-cols-4',
          )}
        >
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                  src={post.media_url}
                  alt={'Instagram image from @wavehounds'}
                  width="500"
                  height="500"
                  loading="lazy" // Optimize loading for performance
                />
               {/* <SanityImage
                  aspectRatio="1/1"
                  data={post.media_url}
                  decoding="sync"
                  sizes="25vw"
                /> */}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({message}: {message: string}) {
  return <p className="text-red-500">{message}</p>;
}
