
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
}
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "welcome" });
const item2 = new Item({ name: "hit the add button" });
const item3 = new Item({ name: "<-- hit this to cross" });

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: String,
  listitems: [itemsSchema]
});

const List =  mongoose.model("List", listSchema);


app.get("/", function(req, res){
  Item.find({}).then(function(data){
    if (data.length === 0){
      Item.insertMany(defaultItems).then(function(data){
        console.log("successfuly save item to database");
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: data} );
    }

   });
});
app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list

  const item = new Item(
    {
      name: itemName
    });
    if (listName === "Today"){
      item.save();
      res.redirect("/");
    } else {
      List.findOne({name: listName}).then(function(data){
        data.listitems.push(item);
        data.save();
        res.redirect("/" + listName);
      });
    }

});

app.post("/delete", function(req, res){
   const checkedId = req.body.checkbox;
   const listName = req.body.listName;

   if (listName === "Today"){
     Item.findByIdAndRemove(checkedId).then(function(){
       // console.log("delete successful");
      });
      res.redirect("/");
   } else {
     List.findOneAndUpdate({name: listName},{$pull: {listitems: {_id: checkedId}}}).then(function(){
       // console.log("successful delete Update");
     });
     res.redirect("/" + listName)
   }
});


app.get("/:newRouteName", function(req, res){
     const newRoute = _.capitalize(req.params.newRouteName);

     List.findOne({name: newRoute}).then(function(data){
       if (!data){
         //  create new list
         const list = new List({
           name: newRoute,
           listitems: defaultItems
         });
         list.save()
         res.redirect("/" +  newRoute);
       } else {
         //  show already existing list
         res.render("list", {listTitle: data.name, newListItems: data.listitems});
       }

     });
});
app.get("/about", function(req, res){
  res.render("about", {});
});

app.listen(3000, function(){
  console.log("server is running on port 3000");
});
