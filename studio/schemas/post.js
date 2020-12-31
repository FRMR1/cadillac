export default {
    name: "post",
    title: "Post",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
        },
        {
            name: "publishedAt",
            title: "Published at",
            type: "datetime",
        },
        {
            name: "body",
            title: "Body",
            type: "blockContent",
        },
    ],

    preview: {
        select: {
            title: "title",
        },
        // prepare(selection) {
        //   const {author} = selection
        //   return Object.assign({}, selection, {
        //     subtitle: author && `by ${author}`,
        //   })
        // },
    },
}
