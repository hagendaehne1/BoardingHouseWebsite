import ListingController from "./ListingController.js";
import Listing from "./Listing.js";
import User from "./User.js";
import Owner from "./Owner.js";
import Admin from "./Admin.js";
import UserController from './UserController.js';

export function initializeData() {
  const listing1 = new Listing('Cozy Apartment', 1000.00, '142/19 Nguyen Thi Thap St. Binh Thuan Ward Dist. 7,Ho Chi Minh City,Vietnam', 'A comfortable apartment in the heart of the city.', 'owner1@example.com', '/images/pexels-charlotte-may-5824531.jpg', true);
  const listing2 = new Listing('Spacious House', 2000.00, '24 B3 Mai Dich Street Group 217 Cau Giay District,Hanoi,Vietnam', 'A large family home with a beautiful garden.', 'owner2@example.com', '/images/pexels-jonathanborba-5570224.jpg', true);
  const listing3 = new Listing('Modern Loft', 1500.00, '20B Ky Dong Ward 9 Dist.3,Ho Chi Minh City,Vietnam', 'A stylish loft apartment with great views.', 'owner3@example.com', '/images/pexels-zvolskiy-3581753.jpg', true);

  ListingController.addListing(listing1);
  ListingController.addListing(listing2);
  ListingController.addListing(listing3);

  const user1 = new User('Test', 'User', 'user@user.com', '123')
  UserController.addUser(user1)

  const owner1 = new Owner('Test', 'Owner', 'owner@owner.com', '123')
  UserController.addOwner(owner1)

  const admin1 = new Admin('Test', 'Admin', 'admin@admin.com', '123')
  UserController.addAdmin(admin1)

}