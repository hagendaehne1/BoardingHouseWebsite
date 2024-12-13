class UserController {
    static users = [];
  
    static addUser(user) {
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