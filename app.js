const express=require('express');
const bodyParser=require('body-parser');
const graphqlHttp=require('express-graphql');
// this is used for adding schemas
// buildSchema is a functions that takes a string, that string defines our schema 
const mongoose=require('mongoose');

const app=express();

app.use(bodyParser.json());

const graphQlSchema=require('./graphql/schema/index');
const graphQlResolvers=require('./graphql/resolvers/index');

app.use('/graphql',graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
})
);

// mongoose.connect(
//     `mongodb+srv://${process.env.MONGO_USER}:${
//     process.env.MONGO_PASSWORD
//     }@cluster0-wphdd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
//     ).then(()=>{
//         app.listen(5600);
//         console.log("connected");
//     })
//     .catch(err=>{
//         console.log(err);
//     })

mongoose.connect("mongodb://localhost/events-react-dev",{useNewUrlParser:true})
.then(()=>{
    app.listen(5600);
    console.log("connected");
})
.catch(error=>{
    console.log(error);
});
