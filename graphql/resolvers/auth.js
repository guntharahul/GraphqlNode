const bcrypt=require('bcryptjs')
const User=require('../../models/user');

module.exports={
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
            return {
                    ...result._doc,password:null,
                    _id:result._doc._id.toString()}    //password is set to null, because it should not be retrieved
        }
            catch(err){
            console.log(err);
            throw err;
        }
    }
}