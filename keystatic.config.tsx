
import { config, fields, collection } from '@keystatic/core';
import { block, inline } from '@keystatic/core/content-components';
import { Sigma } from 'lucide-react';

export default config({
  storage: {
    kind: 'local',
  },

  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: {
        contentField: 'content',
      },

      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
          },
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
            {
              label: 'Reading',
              value: 'reading',
            },
            {
              label: 'Work',
              value: 'work',
            },
          ],
          defaultValue: 'reading',
        }),

        tags: fields.array(
          fields.text({
            label: 'Tag',
          }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
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

          components: {
            Math: block({
              label: 'Math',
              icon: <Sigma/>,

              schema: {
                expression: fields.text({
                  label: 'LaTeX expression',
                  multiline: true,
                }),
              },
              // @ts-ignore
              preview: (props) => (
                <div
                  style={{
                    padding: '0.5rem',
                    fontFamily: 'monospace',
                    background: '#f5f5f5',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {props.fields.expression.value || 'Enter LaTeX…'}
                </div>
              ),
            }),

            InlineMath: inline({
              label: 'Math (inline)',
              icon: <Sigma/>,

              schema: {
                expression: fields.text({
                  label: 'LaTeX expression',
                }),
              },
// @ts-ignore
              preview: (props) => (
                <code>
                  {props.fields.expression.value || 'Enter LaTeX…'}
                </code>
              ),
            }),
          },
        }),
      },
    }),
  },
});

