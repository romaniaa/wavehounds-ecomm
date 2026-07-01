import {EyeOff} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'instagramFeedSection',
  title: 'Instagram Feed',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'The title displayed above the Instagram feed.',
    }),
    defineField({
      name: 'initialAccessToken',
      type: 'string',
      title: 'Access Token',
      description:
        'The Instagram API access token. Make sure this is valid with the required permissions.',
    }),
    defineField({
      name: 'numImages',
      type: 'number',
      title: 'Number of Images',
      description: 'The number of Instagram images to display.',
      validation: (Rule: any) =>
        Rule.required()
          .min(1)
          .max(12)
          .error('The number of images must be between 1 and 12.'),
    }),
    defineField({
      name: 'numColumns',
      type: 'number',
      title: 'Number of Columns',
      description: 'The number of columns in the grid layout.',
      validation: (Rule: any) =>
        Rule.required()
          .min(1)
          .max(4)
          .error('The number of columns must be between 1 and 4.'),
    }),
    defineField({
      name: 'settings',
      type: 'sectionSettings',
      title: 'Settings',
    }),
  ],
  initialValue: {
    numImages: 6,
    numColumns: 3,
    settings: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
  },
  preview: {
    select: {
      title: 'title',
      settings: 'settings',
    },
    prepare({title, settings}: any) {
      return {
        title: title || 'Instagram Feed',
        media: settings?.hide ? EyeOff : undefined,
      };
    },
  },
});
