const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bookingSchema=new Schema({
    event:{
        type:Schema.Types.ObjectId,
        ref:'Event'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},
{
    timestamps:true //this will show when the booking happened or when the booking is done (time)
}
);

module.exports=mongoose.model('Booking',bookingSchema);