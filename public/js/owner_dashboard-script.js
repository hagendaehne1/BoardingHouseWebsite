window.viewDetails = async function(listingId) {
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
};

document.getElementById('create-post-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const price = document.getElementById('post-price').value;
    const description = document.getElementById('post-description').value;

    console.log("Creating post with values:", { title, price, description });

    fetch('/api/create-post', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, description })
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
    
    // Clear the form
    e.target.reset();

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
    modal.hide();
    location.reload();
});

// Function to create a listing card
function createListingCard(listing) {
    if (!listing.verified) {
        return
    }
    if (!listing.image) {
        listing.image = "/images/pexels-markusspiske-102155.jpg";
    }
    return `
        <div class="col-md-4 mb-4">
            <div class="card listing-card">
                <img src="${listing.image}" class="card-img-top" style="height: 500px; width: 100%; object-fit: cover">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">$${listing.price}/month</p>
                    <a onclick="viewDetails('${listing.id}')" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `;
}

async function loadListings(containerId) {
    try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        const listings = await response.json();
        
        // Target the container dynamically
        const listingsContainer = document.getElementById(containerId);
        if (!listingsContainer) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }
        
        // Populate listings in the container
        listingsContainer.innerHTML = listings.map(createListingCard).join('');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load listings. Please try again.');
    }
}

function displayListingDetails(listing) {
    const detailsContainer = document.getElementById('listing-details');
    if (!listing.image) {
        listing.image = "/images/pexels-markusspiske-102155.jpg";
    }
    detailsContainer.innerHTML = `
        <h3>${listing.title}</h3>
        <img src="${listing.image}" class="img-fluid mb-3" style="height: 500px; width: 100%; object-fit: cover">
        <p><strong>Price:</strong> $${listing.price}/month</p>
        <p><strong>Description:</strong> ${listing.description}</p>
    `;
    
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

// Initialize listings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadListings('owner-listings-container');
});