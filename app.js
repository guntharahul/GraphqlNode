const express=require('express');
const bodyParser=require('body-parser');
const graphqlHttp=require('express-graphql');
const { buildSchema }=require('graphql');
// this is used for adding schemas
// buildSchema is a functions that takes a string, that string defines our schema 
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')

const Event=require('./models/event');
const User=require('./models/user');

const app=express();

app.use(bodyParser.json());


const events=eventIds=>{
    return Event.find({_id:{$in: eventIds}})
    .then(events=>{
        return events.map(event=>{
            return {...event._doc, _id: event.id, creator:user.bind(this, event._doc.creator)}
        });
    })
    .catch(err=>{
        throw err;
    });
};

const user=userId=>{
    return User.findById(userId)
    .then(user=>{
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
    })
    .catch(err=>{
        throw err;
    });
};

app.use('/graphql',graphqlHttp({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }
        type User{
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }

        type Rootquery{
            events:[Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput):Event
            createUser(userInput: UserInput):User
        }

        schema{
            query:Rootquery
            mutation:RootMutation
        }
    `),
    rootValue:{
        events: () => {
            return Event.find()
                // .populate('creator')            //populate function is used to get the data of all feild from user by mongoose relation mapping.
                .then( events =>{
                return events.map(event => {
                    return { ...event._doc, _id: event._doc._id.toString(),
                            creator: user.bind(this, event._doc.creator)
                    
                    }; // we can directly event.id which is database property for _id.
                });
                })
                .catch(err=>{
                    console.log(err);
                    throw err;
                });
        },
        createEvent: (args) =>{
            const event=new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5e3fb2e53a46516f18e206dd'
            })
            let createdEvent;
            return event   // this is a promise funciton as first graphql show finish its valid operation and then to the save it to database
            .save()
            .then(result=>{
                createdEvent= {...result._doc, _id:result._doc._id.toString(), 
                            creator: user.bind(this, result._doc.creator)};                    //to get all the meta data and results of the return statement    
                return User.findById('5e3fb2e53a46516f18e206dd');
            })
            .then(user=>{
                if(!user){
                    throw new error("User does not exists");
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result=>{
                return createdEvent;
            })
            .catch(err=>{
                console.log(err);
                throw err;
            });
        },
        createUser: (args) =>{
            return User.findOne({email:args.userInput.email})
            .then(user=>{
                if(user){
                    throw new error("User alredy exists, please try a different email");
                }
                return bcrypt.hash(args.userInput.password,12)
            })
            .then(hashedPassword=>{
                const user=new User({
                    email:args.userInput.email,
                    password:hashedPassword
                });
                return user.save();
            })
            .then(result=>{
                console.log(result);
                return {...result._doc,password:null,_id:result._doc._id.toString()}    //password is set to null, because it should not be retrieved
            })
            .catch(err=>{
                console.log(err);
                throw err;
            });
        }
    },
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
