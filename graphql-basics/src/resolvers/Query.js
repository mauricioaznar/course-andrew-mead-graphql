const Query = {
    users: function (parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }
        return db.users.filter((user) => {
            return user.name
                .toLocaleLowerCase()
                .includes(args.query.toLocaleLowerCase())
        })
    },
    posts: function (parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        }
        return db.posts.filter((post) => {
            return (
                post.body
                    .toLocaleLowerCase()
                    .includes(args.query.toLocaleLowerCase())
                ||
                post.title
                    .toLocaleLowerCase()
                    .includes(args.query.toLocaleLowerCase())

            )
        })
    },
    comments: function (parent, args, { db }, info) {
        return db.comments
    },
    me: function (parent, { db }, ctx, info) {
        return {
            id: 'asdfa',
            name: 'Mike',
            email: 'mike@example.com',
            age: 28
        }
    },
}

export default Query