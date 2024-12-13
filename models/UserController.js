class UserController {
    static users = [];
    static owners = [];
  
    static addUser(user) {
      this.users.push(user);
    }

    static addOwner(user) {
      this.users.push(user);
    }
  
    static getUsers() {
      return this.users;
    }

    static getUserByEmail(email) {
        for (const user of this.users) {
            if (user.email === email) {
                return user
            }
        }
    }
  
  }
  
export default UserController;