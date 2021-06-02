const Comment = {
    author: function (parent, args, { db }, info) {
        return db.users.find(user => {
            return user.id === parent.author
        })
    },
    post: function (parent, args, { db }, info) {
        return db.posts.find(post => {
            return post.id === parent.post
        })
    }
}

export default Comment