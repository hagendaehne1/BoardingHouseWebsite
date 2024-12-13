class UserController {
    static users = [];
    static owners = [];
    static admins = [];
  
    static addUser(user) {
      this.users.push(user);
    }

    static addOwner(owner) {
      this.users.push(owner);
    }

    static addAdmin(admin) {
      this.users.push(admin);
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