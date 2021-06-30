const graphql =  require('graphql');
const _ = require('lodash');
const axios = require('axios');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLNonNull } = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: { type: GraphQLString }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:9000/users?id=${args.id}`)
                .then(resp => {
                    return resp.data[0];
                })
                .catch(error => error)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                company: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                const  { 
                    firstName, 
                    age, 
                    company = "TCS" 
                } = args;
                return axios.post(`http://localhost:9000/users`, { firstName, age, company  })
                .then(resp => {
                    console.log(resp)
                    return resp.data;
                })
                .catch(error => error)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})