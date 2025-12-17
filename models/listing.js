const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: 'listingimage'
        },
        url: {
            type: String,
            default: 'https://c4.wallpaperflare.com/wallpaper/658/800/994/simple-simple-background-minimalism-black-background-wallpaper-preview.jpg',
            set: (v) => v === "" ?
                'https://c4.wallpaperflare.com/wallpaper/658/800/994/simple-simple-background-minimalism-black-background-wallpaper-preview.jpg'
                : v
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

// All reviews will delete after deleting listing
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;