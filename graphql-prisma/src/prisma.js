import {Prisma} from 'prisma-binding'
import {fragmentReplacements} from "./resolvers";

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: "aaaabbbbccccdddd",
    fragmentReplacements: fragmentReplacements
})

export {prisma as default}

// const createPostForUser = async function (authorId, data) {
//     const userExists = await prisma.exists.User({
//         id: authorId
//     })
//     if (!userExists) {
//         throw new Error('User not found')
//     }
//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ id title }')
//     return await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     }, '{ id name email posts { id title published }}')
// }


// createPostForUser("ckpbkub0a006y0992q1patthx", {
//     title: "pasdf",
//     body: "asdfasdfasdfasdfasdfap[peireieioeipeipeipeipeieiei",
//     published: true,
// })
// .then(result => {
//     console.log(JSON.stringify(result, undefined, 2))
// })
// .catch(e => {
//     console.log(e)
// })


// const updatePostForUser = async function (postId, data) {
//     const postExists = await prisma.exists.Post({
//         id: postId
//     })
//     if (!postExists) {
//         throw new Error('Post not found')
//     }
//     const post = await prisma.mutation.updatePost({
//         data: {
//             ...data,
//         },
//         where: {
//             id: postId
//         }
//     }, '{ id title author { id name email posts { id title body published } } }')
//     return post.author
// }
//
// updatePostForUser("ckpbqsdls02c50992sruelksx", {
//     title: "pasdf",
//     body: "asdfasdfasdfasdfasdfap[peireieioeipeipeipeipeieiei ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
//     published: true,
// })
//     .then(result => {
//         console.log(JSON.stringify(result, undefined, 2))
//     })
//     .catch(e => {
//         console.log(e.message)
//     })