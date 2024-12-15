class ListingController {
  static listings = [];

  static addListing(listing, email) {
    this.listings.push({ ...listing, createdBy: email });
  }

  static deleteListing(id) {
    console.log(id)
    const index = this.listings.findIndex((listing) => listing.id === id);

    if (index > -1) {
      this.listings.splice(index, 1);
      return true;
    }
    return false;
  }


  static getListings() {
    return this.listings.map(({ createdBy, ...listing }) => listing);
  }


  static getListingById(id) {
    return this.listings.find((listing) => listing.id === id) || null;
  }
  

  static getCreatorEmailByListingId(id) {
    const listing = this.listings.find((listing) => listing.id === id);
    return listing ? listing.createdBy : null;
  }


  static getListingsByCreator(email) {
    return this.listings
      .filter((listing) => listing.createdBy === email)
  }

}

// Example Usage:
// ListingController.addListing({ id: "1", name: "Apartment" }, "user@example.com");
// ListingController.deleteListing("1", "user@example.com");
// console.log(ListingController.getListings());

  
export default ListingController