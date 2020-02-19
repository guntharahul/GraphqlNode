const Event=require('../../models/event');
const{transformEvent}=require('./merge')



module.exports={
    events: async() => {
        try{
        const events=await Event.find()
            // .populate('creator')            //populate function is used to get the data of all feild from user by mongoose relation mapping.
            return events.map(event => {
                return transformEvent(event); // we can directly event.id which is database property for _id. check in transformEvent() function
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
            createdEvent= transformEvent(result);                    //to get all the meta data and results of the return statement    
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
    }
}