import {GraphQLServer, PubSub} from "graphql-yoga";
import db from './db'
import {resolvers, fragmentReplacements} from "./resolvers";

import prisma from './prisma'

// Demo user data

const pubsub = new PubSub()


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: resolvers,
    context: function (request) {
        return {
            db,
            prisma,
            pubsub,
            request
        }
    },
    fragmentReplacements: fragmentReplacements
})

server.start(() => {
    console.log('The server is up')
})