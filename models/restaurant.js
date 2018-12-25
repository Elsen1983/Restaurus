//
var mongoose = require("mongoose");

var restaurantSchema = mongoose.Schema({
    id: Number,
    name: String,
    neighborhood: String,
    address: String,
    photograph: String,
    latlng: {
      lat: Number,
      lng: Number,
    },
    cuisine_type: String,
    operating_hours: {
        Monday: String,
        Tuesday: String,
        Wednesday: String,
        Thursday: String,
        Friday: String,
        Saturday: String,
        Sunday: String
    },
    reviews: []
});

var Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;