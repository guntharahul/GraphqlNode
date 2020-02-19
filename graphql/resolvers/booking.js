const Booking= require('../../models/booking');
const Event=require('../../models/event');
const{transformEvent,trasnformBooking}=require('./merge')


module.exports={
    
    bookings:async()=>{
        try{
            const bookings=await Booking.find();
            return bookings.map(booking=>{
                return trasnformBooking(booking);
            });
        }catch(err){
            console.log(err);
            throw err;
        }
    },
    bookEvent:async (args) => {
        const fetchedEvent=await Event.findOne({_id:args.eventId});
        const booking=new Booking({
            user:'5e46d3a9b7594a74d895711a',
            event: fetchedEvent
        });
        const result=await booking.save();
        return trasnformBooking(result);        //check transforBooking function 
    },
    cancelBooking: async (args)=>{
        try{
            const booking=await Booking.findById(args.bookingId).populate('event');
            const event= transformEvent(booking.event); //getting the data of the event of the cancelled booking
            await Booking.deleteOne({_id:args.bookingId});
            console.log(event);
            return event;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}