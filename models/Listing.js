import { randomUUID } from 'crypto'

// attribute for verification
class Listing {
    constructor(title, price, description, image = undefined, verified = false) {
        this.id = randomUUID();
        this.title = title;
        this.price = price;
        this.image = image;
        this.description = description;
        this.verified = verified
    }
}

export default Listing;