import ListingController from "./ListingController.js"
import Listing from "./Listing.js"
import User from "./User.js"
import Owner from "./Owner.js"
import Admin from "./Admin.js"
import UserController from './UserController.js'
import bcrypt from 'bcryptjs';


export async function initializeData() {
  const listing1 = new Listing('Cozy Apartment', 1000.00, '1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội, Vietnam', 'A comfortable apartment in the heart of the city.', 'owner1@example.com', '/images/pexels-charlotte-may-5824531.jpg', true)
  const listing2 = new Listing('Spacious House', 2000.00, '1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội, Vietnam', 'A large family home with a beautiful garden.', 'owner1@example.com', '/images/pexels-jonathanborba-5570224.jpg', true)
  const listing3 = new Listing('Modern Loft', 1500.00, '1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội, Vietnam', 'A stylish loft apartment with great views.', 'owner2@example.com', '/images/pexels-zvolskiy-3581753.jpg', true)


  ListingController.addListing(listing1, 'owner1@owner.com')
  ListingController.addListing(listing2, 'owner1@owner.com')
  ListingController.addListing(listing3, 'owner2@owner.com')


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123', salt);

  const user1 = new User('Test', 'User', 'user@user.com', hashedPassword)
  UserController.addUser(user1)

  const owner1 = new Owner('Test', 'Owner1', 'owner1@owner.com', hashedPassword)
  UserController.addOwner(owner1)

  const owner2 = new Owner('Test', 'Owner2', 'owner2@owner.com', hashedPassword)
  UserController.addOwner(owner2)

  const admin1 = new Admin('Test', 'Admin', 'admin@admin.com', hashedPassword)
  UserController.addAdmin(admin1)

}