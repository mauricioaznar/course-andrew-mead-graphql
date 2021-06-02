const User = {
    posts: function (parent, args, {db}, info) {
        return db.posts.filter(post => {
            return parent.id === post.author
        })
    },
    comments: function (parent, args, {db}, info) {
        return db.comments.filter(comment => {
            return parent.id === comment.author
        })
    }
}

export default User