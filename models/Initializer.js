import ListingController from "./ListingController.js";
import Listing from "./Listing.js";
import User from "./User.js";
import UserController from './UserController.js';

export function initializeData() {
  const listing1 = new Listing(1, 'Cozy Apartment', 1000.00, '/images/pexels-charlotte-may-5824531.jpg', 'A comfortable apartment in the heart of the city.');
  const listing2 = new Listing(2, 'Spacious House', 2000.00, '/images/pexels-jonathanborba-5570224.jpg', 'A large family home with a beautiful garden.');
  const listing3 = new Listing(3, 'Modern Loft', 1500.00, '/images/pexels-zvolskiy-3581753.jpg', 'A stylish loft apartment with great views.');

  ListingController.addListing(listing1);
  ListingController.addListing(listing2);
  ListingController.addListing(listing3);

  const user1 = new User('Test', 'User', 'testuser@testmail.com', 'test123')
  UserController.addUser(user1)
}