import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone" 
import { GraphQLError } from 'graphql';


// types
import { typeDefs } from "./schemas/schema.js";

import { resolvers } from "./resolvers/resolvers.js";

import jwt from "jsonwebtoken";

import { connect, User } from "./db/db.js";
import morgan from 'morgan'


// morgan(':method :url :status :res[content-length] - :response-time ms')

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server,
    {
        context: async ({ req }) => {
            const token = req.headers.authorization || false;
            let isVerified = false;
            let user = null;

            if (token !== false ){
                isVerified = jwt.verify(token, "superpasssalt", async (err, decodedToken) => {
                    if (err){
                        throw "Invalid token";
                    }
                    let splitted = decodedToken.id_name.split(" ");
                    const users = await User.findAll({
                        where: {
                            id: parseInt(splitted[0]),
                            name: splitted[1]
                        },
                    });
                    return users[0];
                });
                user = await isVerified;
            }

            // User it not logged in but wants to log in or sign up
            if (
                token === false 
                && req.body.query.toLowerCase().includes("loginuser") === false
                && req.body.query.toLowerCase().includes("adduser") === false
            ){
                  throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                    });
            }

            return { token, user };
          },
        listen: { port: 4000 }
    }
);

