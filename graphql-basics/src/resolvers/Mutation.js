import uuidv4 from 'uuid/v4'
import Post from "./Post";

const Mutation = {
    createUser: function (parent, args, { db }, info) {
        const emailTaken = db.users.some(user => {
            return user.email === args.data.email
        })

        if (emailTaken) {
            throw new Error('Email taken.')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)

        return user
    },
    deleteUser: function (parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => {
            return user.id === args.id
        })
        if (userIndex === -1) {
            throw new Error('User not found')
        }
        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter(post => {
            const match = post.author === args.id

            if (match) {
                db.comments = db.comments.filter(comment => {
                    return comment.post !== post.id
                })
            }

            return !match
        })

        db.comments = db.comments.filter(comment => {
            return comment.author !== args.id
        })

        return deletedUsers[0]
    },
    updateUser: function(parent, args, { db }, info) {
        const { id, data } = args
        const user = db.users.find(( user ) => {
            return user.id === id
        })
        if (!user) {
            throw new Error('User not found')
        }
        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => {
                return user.email === data.email
            })
            if (emailTaken) {
                throw new Error('Email taken')
            }
            user.email = data.email
        }
        if (typeof data.name === 'string') {
            user.name = data.name
        }
        if (typeof data.age === 'number' || data.age === null) {
            user.age = data.age
        }

        return user
    },
    createPost: function (parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User not found.')
        }


        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        if (post.published) {
            pubsub.publish(`post`, {
                post: {
                    data: post,
                    mutation: 'CREATED'
                }
            })
        }

        return post
    },
    updatePost: function(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find(( post ) => {
            return post.id === id
        })
        const originalPost = {...post}

        if (!post) {
            throw new Error('Post not found')
        }
        if (typeof data.title === 'string') {
            post.title = data.title
        }
        if (typeof data.body === 'string') {
            post.body = data.body
        }
        if (typeof data.published === 'boolean') {
            post.published = data.published
            if (originalPost.published && !post.published) {
                pubsub.publish(`post`, {
                    post: {
                        data: originalPost,
                        mutation: 'DELETED'
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish(`post`, {
                    post: {
                        data: post,
                        mutation: 'CREATED'
                    }
                })
            } else {
                if (post.published) {
                    pubsub.publish(`post`, {
                        post: {
                            data: post,
                            mutation: 'UPDATED'
                        }
                    })
                }
            }
        } else {
            if (post.published) {
                pubsub.publish(`post`, {
                    post: {
                        data: post,
                        mutation: 'UPDATED'
                    }
                })
            }
        }

        return post
    },
    deletePost: function (parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => {
            return post.id === args.id
        })
        if (postIndex === -1) {
            throw new Error('Post not found')
        }

        const deletedPosts = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => {
            return comment.post === args.id
        })

        const post = deletedPosts[0]

        if (post.published) {
            pubsub.publish(`post`, {
                post: {
                    data: post,
                    mutation: 'DELETED'
                }
            })
        }

        return post
    },
    createComment: function (parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error('User not found.')
        }

        const postExists = db.posts.some(post => {
            return post.id === args.data.post
        })
        if (!postExists) {
            throw new Error('Post sdoesnt exist')
        }
        const post = db.posts.find(post => {
            return post.id === args.data.post
        })
        if (!post.published) {
            throw new Error('Post is not published')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)

        pubsub.publish(`comment`, {
            comment: {
                data: comment,
                mutation: 'CREATED'
            }
        })

        return comment
    },
    updateComment: function(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find(( comment ) => {
            return comment.id === id
        })
        if (!comment) {
            throw new Error('Comment not found')
        }
        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment`, {
            comment: {
                data: comment,
                mutation: 'UPDATED'
            }
        })

        return comment
    },
    deleteComment: function (parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((post) => {
            return post.id === args.id
        })
        if (commentIndex === -1) {
            throw new Error('Post not found')
        }

        const [comment] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment`, {
            comment: {
                data: comment,
                mutation: 'DELETED'
            }
        })

        return comment
    },
}

export default Mutation