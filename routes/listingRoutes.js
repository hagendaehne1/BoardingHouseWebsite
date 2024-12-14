import express from 'express';

import ListingController from '../models/ListingController.js';
import Listing from '../models/Listing.js';
import upload from '../multer/config.js'

const router = express.Router();

router.get('/api/listings', async (req, res) => {
    try {
      const listings = ListingController.getListings();
      res.json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
router.get('/api/listings/:id', async (req, res) => {
try {
    const listingId = req.params.id;
    const listing = ListingController.getListingById(listingId);
    
    if (listing) {
    res.json(listing);
    } else {
    res.status(404).json({ error: 'Listing not found' });
    }
} catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});


router.post("/api/create-post", upload.single("image"), (req, res) => {

const { title, price, address, description, contact } = req.body
const file = req.file;

if (file) {
  ListingController.addListing(new Listing(title, price, address, description, contact, `images/${file.filename}`))

} else {
  ListingController.addListing(new Listing(title, price, address, description, contact, undefined))
}
})

router.get('/api/verifylisting/:id', async (req, res) => {
  try {
      const listingId = req.params.id;
      const listing = ListingController.getListingById(listingId);
      
      if (listing) {
        listing.verified = true
        res.json(listing);
      } else {
      res.status(404).json({ error: 'Listing not found' });
      }
  } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
  });

export default router;