import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import {ruruHTML} from "ruru/server"
import express from 'express';
import { db } from './db.js';
import { User } from './models/userModels.js';

db()


//all fields name as in the mongoose schema and define the types using GraphQLObjectType
const UserTypes = new GraphQLObjectType({
  name: "User", 
  fields:{
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    isAdmin: {type: GraphQLBoolean}
  }
})
 
// Construct a schema
const schema = new GraphQLSchema({ // what resolvers will be used
  query: new GraphQLObjectType({
    name: 'Query', // like get route and used to only for getting data fron db
    fields: {
      hello: { 
        type: GraphQLString,
        resolve: () => 'Hello world!'
      },
      giveMeRandomNumber : {
        type: GraphQLInt,
        resolve: () => Math.floor(Math.random() * 100)
      }, 
      squaringNumber : {
        type: GraphQLInt,
        args: {
          num: {type: GraphQLInt}
        }, 
        resolve: (_, {num}) => num * num
      },
      getAllUser: {
        type: new GraphQLList(UserTypes), //tells what data will be returned
        resolve: async() => { // resolvers like controllers
          try {
            const users = await User.find()
            return users
          } catch (error) {
            console.log(error)
          }
        }
        
      },
      getFilteredUser:{
        type: new GraphQLList(UserTypes),
        args:{
          isAdmin: {type: GraphQLBoolean},
          name: {type: GraphQLString},
          email: {type: GraphQLString}
        },
        resolve: async(_, args) =>{
          try {
            let filter = {}
            if (typeof args.isAdmin === "boolean") {
              filter.isAdmin = args.isAdmin
            }

            if (typeof args.email === "string") {
              filter.email = args.email
            }

            if (typeof args.name === "string") {
              filter.name = args.name
            }
            const user =  await User.find(filter)

            return user
          } catch (error) {
            console.log(error)
          }
        }
      }
    },
  }),
});
 
const app = express();


//to get the graphiql page / interface
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});
 
// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema: schema,
  }),
);
 
// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');