const express = require('express');
const router = express.Router();
const Comic = require("../models/Comics.model");
const Item = require('../models/Items.model');
const Cart = require('../models/ShoppingCart.model');

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET map page with all the postinos
router.get("/map", async (req, res, next) => {
  // Define the locations of the map with the info we want to display in the popup
  const location =  [2.18822, 41.3977607]

  // Define the dislay of the map
  const mapCenter = location
  const mapZoom = 15
  const currUser = req.session.currentUser
  try{
    //checking if there's something inside the cart
      if (currUser) {
        const findCarrito = await Cart.findOne({ userId: currUser});
        const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
        res.render("map", {location, mapCenter, mapZoom, currUser, carritoItems});
      } 
      else {
        res.render("map", { location, mapCenter, mapZoom, currUser  })
      }
  }
  catch(err){
    console.log(err)
  }
  // Render the map
 
});



















router.post("/map", (req, res, next) => {
  
    res.redirect("/map")
})


module.exports = router;
