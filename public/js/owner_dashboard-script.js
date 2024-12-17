import { getCurrentUser } from './userUtils.js';

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

window.logout = function() {
    // Remove the token from localStorage
    localStorage.removeItem('token')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear browser history and redirect
    window.location.replace('/login');
    
    // Force a full page reload to clear any cached content
    window.location.reload(true);
}

document.getElementById('create-post-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const user = await getCurrentUser()
    formData.append("title", document.getElementById("post-title").value);
    formData.append("price", document.getElementById("post-price").value);
    formData.append("address", document.getElementById("post-address").value);
    formData.append("description", document.getElementById("post-description").value);
    formData.append("contact", document.getElementById("post-contact").value);
    formData.append("image", document.getElementById("post-image").files[0]);
    formData.append("creator", user.email)

    console.log("Creating post with values:", formData.entries());

    fetch('/api/create-post', {
        method: 'POST',
        body: formData
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
                    <div class="form-check">
                        <input 
                            class="form-check-input compare-checkbox" 
                            type="checkbox" 
                            value="${listing.id}" 
                            id="compare-${listing.id}"
                            onchange="handleSelection('${listing.id}')"
                        >
                        <label class="form-check-label" for="compare-${listing.id}">
                            Select for Comparison
                        </label>
                    </div>
                    <a onclick="viewDetails('${listing.id}')" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `;
}

let selectedListings = []
// Handle checkbox selection
window.handleSelection = function (listingId) {
    const checkbox = document.getElementById(`compare-${listingId}`);
    
    if (checkbox.checked) {
        // Add listing ID to the selected array
        if (selectedListings.length < 4) {
            selectedListings.push(listingId);
        } else {
            checkbox.checked = false;
            alert("You can only compare up to 4 listings.");
        }
    } else {
        // Remove listing ID from the selected array
        selectedListings = selectedListings.filter((id) => id !== listingId);
    }

    // Enable/disable the "Compare Selected" button
    const compareButton = document.getElementById("compare-selected");
    compareButton.disabled = selectedListings.length === 0;
}

// Submit form to compare selected listings
document.getElementById("compare-form").addEventListener("submit", (e) => {
    e.preventDefault();

    if (selectedListings.length > 0) {
        // Store selected listing IDs in localStorage and navigate to the comparison page
        localStorage.setItem("selectedListings", JSON.stringify(selectedListings));
        window.location.href = "/compare"; // Redirect to the comparison page
    }
});

let allListings = []; // Store all listings globally to allow filtering

// Load listings from the server and initialize the global `allListings`
async function loadListings(containerId) {
    try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        allListings = await response.json(); // Save all listings globally
        
        const listingsContainer = document.getElementById(containerId);
        if (!listingsContainer) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }
        
        // Initially display all listings
        displayListings(allListings, containerId);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load listings. Please try again.');
    }
}

async function loadListingsCurrentOwner(containerId) {
    try {
        const user = await getCurrentUser();

        const response = await fetch('/api/listingsCurrentOwner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }
        const listingsByOwner = await response.json()
        
        const listingsContainer = document.getElementById(containerId);
        if (!listingsContainer) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }
        
        // Initially display all listings
        displayListingsByOwner(listingsByOwner, containerId);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load listings. Please try again.');
    }
}

function displayListingsByOwner(listings, containerId) {
    const listingsContainer = document.getElementById(containerId);
    if (listings.length === 0) {
        listingsContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height: 200px; width: 100%;">
            <h3 class="text-center text-muted">Not Found</h3>
        </div>`
    } else {
        listingsContainer.innerHTML = listings
        .map(createListingCardByOwner)
        .filter((card) => card !== undefined) // Remove undefined results (from unverified listings)
        .join('');
    }    
}

function createListingCardByOwner(listing) {
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
                    <a onclick="deletePost('${listing.id}')" class="btn btn-primary">Delete Post</a>
                </div>
            </div>
        </div>
    `;
}

window.deletePost = async function(listingId) {
    try {
        await fetch(`/api/rejectlisting/${listingId}`);
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load listing details. Please try again.');
    }
}

// Display listings dynamically in the container
function displayListings(listings, containerId) {
    const listingsContainer = document.getElementById(containerId);
    if (listings.length === 0) {
        listingsContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height: 200px; width: 100%;">
            <h3 class="text-center text-muted">Not Found</h3>
        </div>`
    } else {
        listingsContainer.innerHTML = listings
        .map(createListingCard)
        .filter((card) => card !== undefined) // Remove undefined results (from unverified listings)
        .join('');
    }
    
}

// Filter listings based on the price range
function filterListings() {
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    // Convert input values to numbers
    const min = minPrice ? parseFloat(minPrice) : 0; // Default to 0 if no value
    const max = maxPrice ? parseFloat(maxPrice) : Infinity; // Default to Infinity if no value

    // Filter listings based on price range
    const filteredListings = allListings.filter((listing) => {
        return listing.price >= min && listing.price <= max;
    });

    // Redisplay the filtered listings
    displayListings(filteredListings, 'owner-listings-container');
}

// Event listener for the filter form
document.getElementById('filter-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    filterListings();
});

// Event listener for the reset button
document.getElementById('reset-filters').addEventListener('click', () => {
    // Clear input fields
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';

    // Redisplay all listings
    displayListings(allListings, 'owner-listings-container');
});

function displayListingDetails(listing) {
    const detailsContainer = document.getElementById('listing-details');
    if (!listing.image) {
        listing.image = "/images/pexels-markusspiske-102155.jpg";
    }
    detailsContainer.innerHTML = `
        <h3>${listing.title}</h3>
        <img src="${listing.image}" class="img-fluid mb-3" style="height: 500px; width: 100%; object-fit: cover">
        <p><strong>Price:</strong> $${listing.price}/month</p>
        <p><strong>Address:</strong> ${listing.address}
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}" 
                target="_blank" 
                rel="noopener noreferrer">
                <br />
                Search in Google Maps
            </a>
        </p>
        <p><strong>Description:</strong> ${listing.description}</p>
        <p><strong>Contact:</strong> ${listing.contact}</p>
    `;
    
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

// Initialize listings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadListings('owner-listings-container');
    loadListingsCurrentOwner('belongs-to-owner-listings-container');
});