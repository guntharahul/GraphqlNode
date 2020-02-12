const bcrypt=require('bcryptjs')
const Event=require('../../models/event');
const User=require('../../models/user');

const events=eventIds=>{
    return Event.find({_id:{$in: eventIds}})
    .then(events=>{
        return events.map(event=>{
            return {...event._doc,
                     _id: event.id,
                     date:new Date(event._doc.date).toISOString(),
                     creator:user.bind(this, event._doc.creator)}
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

module.exports={
    events: () => {
        return Event.find()
            // .populate('creator')            //populate function is used to get the data of all feild from user by mongoose relation mapping.
            .then( events =>{
            return events.map(event => {
                return { ...event._doc,
                         _id: event._doc._id.toString(),
                         date:new Date(event._doc.date).toISOString(),
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
            createdEvent= {...result._doc,
                        _id:result._doc._id.toString(),
                        date:new Date(event._doc.date).toISOString(), 
                        creator: user.bind(this, result._doc.creator)
                    };                    //to get all the meta data and results of the return statement    
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
}