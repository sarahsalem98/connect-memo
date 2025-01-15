class UserViewModel {
    constructor(data) {
        const { user_id, first_name, last_name, email, password, profilePicture, is_active } = data;
        if (!first_name || !last_name || !email) {
            throw new Error("Missing required fields: user_id, first_name, last_name, email, or password");
        }

        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password; // Raw password, hashed later in the service
        this.profilePicture = profilePicture || null; // Optional
        this.is_active = is_active !== undefined ? is_active : true; // Default to true if not provided
    }
}
module.exports = UserViewModel;