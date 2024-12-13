class ListingController {
    static listings = [];
  
    static addListing(listing) {
      this.listings.push(listing);
    }
  
    static getListings() {
      return this.listings;
    }

    static getListingById(id) {
        for (const l of this.listings) {
            if (l.id === id) {
                return l
            }
        }
    }
  
  }
  
export default ListingController;