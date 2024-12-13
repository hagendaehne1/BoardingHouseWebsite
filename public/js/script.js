// Function to create a listing card
function createListingCard(listing) {
    return `
        <div class="col-md-4">
            <div class="card listing-card">
                <img src="${listing.image}" class="card-img-top" style="height: 500px; width: 100%; object-fit: cover">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">$${listing.price}/month</p>
                    <a onclick="viewDetails(${listing.id})" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Function to load listings
async function loadListings() {
    try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        const listings = await response.json();
        const listingsContainer = document.getElementById('listings-container');
        listingsContainer.innerHTML = listings.map(createListingCard).join('');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load listings. Please try again.');
    }
}

// Function to view details of a listing
// eslint-disable-next-line no-unused-vars
async function viewDetails(listingId) {
    try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch listing details');
        }
        const listingDetails = await response.json();
        displayListingDetails(listingDetails);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load listing details. Please try again.');
    }
}

// Function to display listing details
function displayListingDetails(listing) {
    const detailsContainer = document.getElementById('listing-details');
    detailsContainer.innerHTML = `
        <h3>${listing.title}</h3>
        <img src="${listing.image}" class="img-fluid mb-3" style="height: 500px; width: 100%; object-fit: cover">
        <p><strong>Price:</strong> $${listing.price}/month</p>
        <p><strong>Description:</strong> ${listing.description}</p>
    `;
    
    // Show the details modal
    // eslint-disable-next-line no-undef
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

// Load listings when the page is ready
document.addEventListener('DOMContentLoaded', loadListings);