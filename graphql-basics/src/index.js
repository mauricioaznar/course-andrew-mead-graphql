import {GraphQLServer, PubSub} from "graphql-yoga";
import db from './db'

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Subscription from './resolvers/Subscription'

// Demo user data

const pubsub = new PubSub()

// Resolvers
const resolvers = {
    Query,
    Mutation,
    Comment,
    Subscription,
    Post,
    User
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: resolvers,
    context: {
        db,
        pubsub
    }
})

server.start(() => {
    console.log('The server is up')
})