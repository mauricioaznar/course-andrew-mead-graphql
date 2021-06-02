import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";


const Mutation = {
    logIn: async function (parent, args, {prisma}, info) {
        const user = await prisma.query.user({
            where: {
                email: args.email,
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        const isMatch = await bcrypt.compare(args.password, user.password)

        if (!isMatch) {
            throw new Error('Credentials not valid')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    createUser: async function (parent, args, {prisma}, info) {
        const password = hashPassword(args.data.password, 10)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    deleteUser: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        return await prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    updateUser: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const opArgs = {
            where: {
                id: userId
            },
            data: {
                ...args.data
            }
        }

        if (typeof args.data.password === 'string') {
            const password = await hashPassword(args.data.password, 10)
            opArgs.data = {...opArgs.data, password}
        }

        return await prisma.mutation.updateUser(opArgs, info)
    },
    createPost: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const {author, ...rest} = args.data
        return await prisma.mutation.createPost({
            data: {
                author: {
                    connect: {
                        id: userId
                    }
                },
                ...rest
            }
        }, info)
    },
    updatePost: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to delete post')
        }

        const postPublished = await prisma.exists.Post({
            id: args.id,
            published: true,
            author: {
                id: userId
            }
        })

        if (postPublished && !args.data.published) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        const newArgs = {}

        newArgs.data = {
            ...args.data
        }

        newArgs.where = {
            id: args.id
        }

        return await prisma.mutation.updatePost(newArgs, info)
    },
    deletePost: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to update post')
        }

        return await prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    createComment: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const {post, ...rest} = args.data

        const postExists = await prisma.exists.Post({
            id: post,
            published: true
        })

        if (!postExists) {
            throw new Error('Unable to create comment')
        }

        return await prisma.mutation.createComment({
            data: {
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: post
                    }
                },
                ...rest
            }
        }, info)
    },
    updateComment: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to update comment')
        }


        const {...rest} = args.data
        const newArgs = {}

        newArgs.data = {
            ...rest
        }

        newArgs.where = {
            id: args.id
        }

        return await prisma.mutation.updateComment(newArgs, info)
    },
    deleteComment: async function (parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }

        return await prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
}

export default Mutation