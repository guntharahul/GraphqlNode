const bcrypt=require('bcryptjs')
const Event=require('../../models/event');
const User=require('../../models/user');

const events = async eventIds => {
    try{
    const events= await Event.find({_id:{$in: eventIds}});
    events.map(event=>{
            return {...event._doc,
                     _id: event.id,
                     date:new Date(event._doc.date).toISOString(),
                     creator:user.bind(this, event._doc.creator)
                    };
        });
        return events;
    }
    catch(err){
        throw err;
    }
};

const user = async userId=>{
    try{
    const user= await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch(err) {
        throw err;
    }
};

module.exports={
    events: async() => {
        try{
        const events=await Event.find()
            // .populate('creator')            //populate function is used to get the data of all feild from user by mongoose relation mapping.
            return events.map(event => {
                return { ...event._doc,
                         _id: event._doc._id.toString(),
                         date:new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator)
                
                }; // we can directly event.id which is database property for _id.
            });
        }
        catch(err){
            console.log(err);
                throw err;
            }
    },
    createEvent: async (args) =>{
        const event=new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5e46d3a9b7594a74d895711a'
        })
        let createdEvent;
        try{
        const result = await event.save()   // this is a promise funciton as first graphql show finish its valid operation and then to the save it to database
            createdEvent= {...result._doc,
                        _id:result._doc._id.toString(),
                        date:new Date(event._doc.date).toISOString(), 
                        creator: user.bind(this, result._doc.creator)
                    };                    //to get all the meta data and results of the return statement    
            const creator =await User.findById('5e46d3a9b7594a74d895711a');
            if(!creator){
                throw new error("User does not exists");
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    },
    createUser: async (args) =>{
        try{
        const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser){
                throw new error("User alredy exists, please try a different email");
            }
            const hashedPassword=await bcrypt.hash(args.userInput.password,12)
            const user=new User({
                email:args.userInput.email,
                password:hashedPassword
            });
            const result= await user.save();
            console.log(result);
            return {...result._doc,password:null,_id:result._doc._id.toString()}    //password is set to null, because it should not be retrieved
        }
            catch(err){
            console.log(err);
            throw err;
        }
    }
}