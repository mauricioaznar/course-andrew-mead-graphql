import getUserId from "../utils/getUserId";

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve: function (parent, args, { prisma, request}, info) {
            const userId = getUserId(request, false)

            if (userId && userId === parent.id) {
                return parent.email
            } else {
                return null
            }
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve: function (parent, args, { prisma, request}, info) {
            const userId = getUserId(request, false)
            const parentId = parent.id

            if (userId === parentId) {
                return prisma.query.posts({
                    where: {
                        author: {
                            id: userId
                        }
                    }
                })
            } else {
                return prisma.query.posts({
                    where: {
                        author: {
                            id: parentId
                        },
                        published: true
                    }
                })
            }
        }
    }
}

export default User