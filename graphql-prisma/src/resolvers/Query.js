import getUserId from "../utils/getUserId";

const Query = {
    users: function (parent, args, { db, prisma }, info) {
        const opaArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if (args.query) {
            opaArgs.where = {
                OR: [
                    {
                        name_contains: args.query
                    },
                ]
            }
        }

        return prisma.query.users(opaArgs, info)
    },
    myPosts: function (parent, args, { db, prisma, request }, info) {
        const userId = getUserId(request)

        const opaArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opaArgs.where.OR = [
                {
                    title_contains: args.query
                },
                {
                    body_contains: args.query
                },
            ]
        }

        return prisma.query.posts(opaArgs, info)
    },
    posts: function (parent, args, { db, prisma }, info) {
        const opaArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            where: {
                published: true
            }
        }

        if (args.query) {
            opaArgs.where.OR = [
                {
                    title_contains: args.query
                },
                {
                    body_contains: args.query
                },
            ]
        }

        return prisma.query.posts(opaArgs, info)
    },
    post: async function (parent, args, { db, prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [
                    {
                        published: true
                    },
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    },
    comments: function (parent, args, { db, prisma }, info) {
        const opaArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after
        }

        return prisma.query.comments(opaArgs, info)
    },
    me: async function (parent, args, { db, request, prisma }, info) {
        const userId = getUserId(request)
        return await prisma.query.user({
            where: {
                id: userId,
            }
        }, info)
    },
}

export default Query