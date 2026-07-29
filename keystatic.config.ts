import { config, fields, collection } from '@keystatic/core';

export default config({
//  storage: {
//    kind: 'github',
//    repo: `${REPO_OWNER}/${REPO_NAME}`
// },

storage:{
  kind:"local"
},

  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
        }),

        description: fields.text({
          label: 'Description',
          validation: {
            length: {
              min: 10,
              max: 400,
            },
          },
        }),

        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
        }),

        logType: fields.select({
          label: 'Log Type',
          options: [
            { label: 'Reading', value: 'reading' },
            { label: 'Work', value: 'work' },
          ],
          defaultValue: 'reading',
        }),

        // topics: fields.array(
        //   fields.text({ label: 'Topic' }),
        //   {
        //     label: 'Topics',
        //     itemLabel: props => props.value,
        //   }
        // ),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),

        publishDate: fields.date({
          label: 'Publish Date',
        }),

        updatedDate: fields.date({
          label: 'Updated Date',
        }),

        ogImage: fields.text({
          label: 'OG Image',
        }),

       

        content: fields.mdx({
  label: 'Content',

  options: {
    image: {
      directory: 'src/assets/images/posts',
      publicPath: '../../assets/images/posts',
    },
  },
}),
      },
    }),
  },
});