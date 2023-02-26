const express = require('express');
const router = express.Router();

const Comic = require("../models/Comics.model");
const Item = require('../models/Items.model');
const Cart = require('../models/ShoppingCart.model');

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require('../models/User.model');
const Review = require('../models/Reviews.model');



router.get("/cart", isLoggedIn, async (req, res, next) => {
  try{
    const currUser = req.session.currentUser;
    const findCarrito = await Cart.findOne({ userId: currUser});
    const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
    //We get an array with the price of each comic
    const priceArray = [];
    //let test = carritoItems.quantity
    console.log(carritoItems)
    //let itemQuantity = carritoItems.quantity
    //console.log(itemQuantity);
    carritoItems.map((comic) => {
      let quantity = comic.quantity
    priceArray.push(comic.comicId.price * quantity);
      })
   // We sum the array prices to get the total
    let cartSum = priceArray.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
   let roundedTotal = Math.ceil(cartSum * 100) / 100
   res.render("cart", {carritoItems, currUser, roundedTotal}) 
  }
  catch(err){
    console.log(err)
  }
})


/* GET home page */
router.get("/", async (req, res, next) => {
  const currUser = req.session.currentUser
  try{
    //checking if there's something inside the cart
    if (currUser) {
      const findCarrito = await Cart.findOne({ userId: currUser});
      const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
      res.render("index", {currUser, carritoItems});
    } else {
    res.render("index", {currUser});}
  }
  catch(err){
    console.log(err)
  }
});
// ------------------------ catalogue Routes ------------------------
router.get("/catalogue", async (req, res, next) => {
  try{
  const currUser = req.session.currentUser
  const allComics = await Comic.find()
  //CHECK IF ELEMENTS ARE ON CART 
  if (currUser) {
    const findCarrito = await Cart.findOne({ userId: currUser});
    const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
    res.render(res.render("catalogue", {allComics, currUser, carritoItems}));
  } else {
    res.render("catalogue", {allComics, currUser})}
  } catch (err) {
    console.log("Error getting catalogue:" + err)
  }
})
// --------------------- Product details Routes ------------------------
router.get("/catalogue/:comicId", async (req, res, next) => {
  try{
    const currUser = req.session.currentUser
    const comic = await Comic.findById(req.params.comicId).populate("reviewIds")
    //Calculate Averate Rating
    let ratings = comic.ratingsArray
    const ratingsToNum = ratings.map(str => {
      return Number(str)})
    let sum = ratingsToNum.reduce((partialSum, a) => partialSum + a, 0);
    let averageRating = Math.round(sum / ratings.length * 10) / 10
    //CHECK IF ELEMENTS ARE ON CART 
  if (currUser) {
    const findCarrito = await Cart.findOne({ userId: currUser});
    const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
    res.render(res.render("product-details", {comic, currUser, averageRating, carritoItems}));
  } else {
    res.render("product-details", {comic, currUser, averageRating})
  }
  } catch (err){
    console.log("Error getting product details:" + err)
  }
  
})

//CART ROUTES

router.post("/catalogue/:comicId/add", isLoggedIn, async (req, res, next) => {
  //console.log("we are inside!")
  const currUser = req.session.currentUser
  //console.log(currUser)

  const {comicId} = req.params

  try{
    const newItem = await Item.create({comicId})
    //console.log(newItem)
    const findCarrito = await Cart.findOne({ userId: currUser})
    //console.log(findCarrito)
    const addItemtoCarro = await Item.updateMany({newItem, cartId: findCarrito, quantity: 1})
    //console.log(addItemtoCarro)
    res.redirect("/catalogue")
  }
  catch(err){console.log(err)}
})
//add item to the cart
  router.post("/cart/:itemId/duplicate", isLoggedIn, async (req, res, next) => {
    const {itemId} = req.params
    const {comicQuantity} = req.body
    let toNumber = +comicQuantity
    try{
      const findItem = await Item.findByIdAndUpdate(itemId, {quantity: toNumber})
      console.log(findItem)
      
      //const editQuantity = await Item.findOneAndUpdate({findItem}, {quantity: toNumber} )
      //const editItemQuantity = await Item.findByIdAndUpdate({itemId},{quantity: toNumber})
      res.redirect("/cart")
    }
    catch(err){
      console.log(err)
    }
  }) 
//delete item from the cart
  router.post("/cart/:itemId/delete", isLoggedIn, async (req, res, next) => {
    const {itemId} = req.params
    try {
      const deleteItem = await Item.deleteOne({itemId})
      res.redirect("/cart")
    }
    catch(err){
      console.log(err)
    } 
  })

  //checkout route
  router.post("/cart/checkout", isLoggedIn, async (req, res, next) => {
    const currUser = req.session.currentUser
    //res.redirect("/cart/checkout")
    try {
      //first we find the cart of the current user
      const findCarrito = await Cart.findOne({ userId: currUser})
      //then, we find the items that correspond to that cart
      const newPurchases = await Item.find({cartId: findCarrito})
      console.log("this are new purchases", newPurchases)
      const comics = newPurchases[0].comicId
      const comicArray = [];
      newPurchases.map((comic) => {
        comicArray.push(comic.comicId);
      })
      //later on, we update the User.purchases with the comicIds
      const updatePurchases = await User.findByIdAndUpdate(currUser, {$push: {purchases: comicArray}}, {new: true})
      console.log("this is the updated history:", updatePurchases)
      //finally we refresh the cart
      const deleteAll = await Item.deleteMany({cartId: findCarrito})
      res.redirect("/cart/checkout")
      }
    catch(err){
       console.log(err)
     } 
  })
  router.get("/cart/checkout", isLoggedIn, async (req, res, next) => {
    const currUser = req.session.currentUser
    res.render("checkout", {currUser})
  })

// profile page
router.get("/myprofile", isLoggedIn, async(req, res, next) => {
  const currUser = req.session.currentUser
  try{
    const findUser = await User.findById(currUser).populate("purchases")
    //check if there are items on the cart
    const findCarrito = await Cart.findOne({ userId: currUser});
    const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
    res.render("profile", {findUser, currUser, carritoItems})
  }
  catch(err){
    console.log(err)
  }
})

//review page
router.get("/:comicId/review", isLoggedIn, async(req, res, next) => {
  try{
    const currUser = req.session.currentUser
    const {comicId} = req.params
    const comicToReview = await Comic.findById(comicId)
    //console.log(comicToReview)
    //check if there's something on the cart
    const findCarrito = await Cart.findOne({ userId: currUser});
    const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
    res.render("review-form", {currUser, comicToReview, carritoItems})
  }
  catch(err){
    console.log(err)
  }
})
 router.post("/:comicId/review/post", isLoggedIn, async(req, res, next) => {
  const user = req.session.currentUser
  try{
        const {comicId} = req.params
        const {title, quantity, description} = req.body
        const newReview = await Review.create({userId: user, username: user.username, comicId: comicId, title: title, content: description, rating: quantity})
        //console.log(newReview)
        //average review
        const updateComic = await Comic.findByIdAndUpdate(comicId, {$push: {reviewIds: newReview}}, {new: true})
        const updateComicRatings = await Comic.findByIdAndUpdate(comicId, {$push: {ratingsArray: quantity}}, {new: true})
        res.redirect("/")
    }
    catch(err){console.log(err)}
 })





 router.get("/about", async (req, res) => {
  const currUser = req.session.currentUser
  try{
    if (currUser) {
      const findCarrito = await Cart.findOne({ userId: currUser});
      const carritoItems = await Item.find({cartId: findCarrito._id}).populate('comicId');
      res.render("about", {currUser, carritoItems});
    } 
    else {
      res.render("about", {currUser});
    }
  }
  catch(err){
    console.log(err)
  }
});


module.exports = router;
