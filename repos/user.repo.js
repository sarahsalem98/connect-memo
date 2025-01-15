const User = require("../models/user.model")

module.exports.getUsers = async () => {
    try {
        const users = User.find({});
        return users;

    } catch (error) {
        console.log(error)
    }

};
module.exports.updateUser = async (UserViewModel) => {
    try{
        let user= await User.findOne({ user_id: UserViewModel.user_id });
        if(user){
            user.first_name = UserViewModel.first_name || user.first_name;
            user.last_name = UserViewModel.last_name || user.last_name;
            user.email = UserViewModel.email || user.email;
            user.password=user.password;
            user.profilePicture = UserViewModel.profilePicture || user.profilePicture;
            user.is_active = UserViewModel.is_active !== undefined ? UserViewModel.is_active : user.is_active;

           var updateduser= await user.save();
          return updateduser;
        }else{
            return null;
        }

    }catch(error){
        console.log(error);
    }
};
module.exports.getUser = async (id) => {
    try {
        const user = await User.findOne({ user_id: id });
        return user;

    } catch (error) {
        console.log(error);
    }
}
module.exports.createUser = async (UserModel) => {
    try {
        const savedUser = await UserModel.save();
        return savedUser;
    } catch (error) {
        console.log(error);
    }
};

module.exports.deleteUser = async (id) => { 
    try{
        const result = await User.findOneAndDelete({ user_id: id });
        
        if (!result) {
            throw new Error("User not found");
        }

        return result;

    }catch(error){
        console.log(error);
    }

};

module.exports.changeStatus=async(id)=>{
    try{
        let user = await User.findOne({ user_id: id });
        let result=null;
         if(user){
            user.is_active=false;
            result=await user.save();
         }
         return result;

    }catch(error){
        console.log(error);
    }
}