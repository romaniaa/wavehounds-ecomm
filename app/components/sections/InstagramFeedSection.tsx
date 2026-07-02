import React, {useEffect, useState} from 'react';
import type {TypeFromSelection} from 'groqd';
import type {INSTAGRAM_FEED_SECTION_FRAGMENT} from '~/qroq/sections';
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
  // Note: We no longer need initialAccessToken from Sanity!
  const {title, numColumns} = data;

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        // Fetch from your local Hydrogen proxy endpoint
        const response = await fetch('/api/instagram');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts from server.');
        }
        
        const json = await response.json();
        
        if (json.error) {
          throw new Error(json.error);
        }
        
        setPosts(json.data || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchInstagramPosts();
  }, []);

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
                loading="lazy"
              />
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