var express = require('express');
var server = express();
var http = require('http');
const cors = require('cors');
server.use(cors());

// var app = http.createServer(server);
var bodyParser = require("body-parser");
// const io = require('socket.io').listen(app);

// io.on('connection', socket => { /* ... */ });

// Database Connection and Models
require('./mongoDB/mongoconnection')
var User = require("./mongoDB/user-model");
var OnlineUsers = require("./mongoDB/online-users-model");
var Contact = require("./mongoDB/contact-modal");
var Post = require('./mongoDB/post-ad-model');
var Room = require('./mongoDB/rooms');
var Chat = require('./mongoDB/chat');



server.use(express.static('./build'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.post('/signup', (req, res) => {

    var user = new User(req.body)
    user.save((err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)
        console.log("Data inserted : User Added")
    })
})

server.post('/contact', (req, res) => {
    res.send(req.body);
    console.log(req.body);

    var contact = new Contact(req.body)
    contact.save((err, data) => {
        if (err)
            console.log(err)
        else
            console.log("Data inserted : Contact Request Recieved")
    })
})

server.post('/postad', (req, res) => {
    res.send(req.body);
    console.log(req.body);

    var post = new Post(req.body)
    post.save((err, data) => {
        if (err)
            console.log(err)
        else
            console.log('Data inserted : Ad Post data saved')
    })

})


server.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email, password: password }, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)
    })

})


server.post('/allads', (req, res) => {

    Post.find({}, (err, data) => {
        if (err)
            console.log(err)
        else
            res.send(data)

    })
})


server.post('/userads', (req, res) => {
    // console.log(req.body._id)

    Post.find({ sellerId: req.body._id }, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)

    })
})

// Favorite ads
server.post('/favoriteads', (req, res) => {
    console.log("This is favorite ads req")
    console.log(req.body)

    Post.find({ _id: { $in: req.body } }, (err, data) => {
        if (err)
            console.log(err)
        else {
            console.log(data);
            res.send(data)
        }
    })

})

server.post('/categoryads', (req, res) => {

    console.log(req.body)

    Post.find({ category: req.body.category }, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)

    })
})

server.post('/countryads', (req, res) => {
    console.log('this is country ads request')
    console.log(req.body)

    Post.find({ sellerCountry: req.body.country }, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)

    })
})


server.post('/searchads', (req, res) => {

    console.log(req.body)

    Post.find({ adTitle: new RegExp(req.body.search, 'i') }, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)

    })
})


//Update User Route
server.post('/updateuser', (req, res) => {

    User.findById(req.body.user._id, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log(data)
        res.send(data)

    })
})

//Seller Info Route

server.post('/sellerprofile', (req, res) => {
    // console.log(req.body.sellerId)
    // console.log("This is seller profile request")
    var response =null;

    User.findById(req.body.sellerId, (err, data) => {
        if (err)
            console.log("this is seller progfile error " + err)
        else {

            if (data !== null) {
                response = {
                    data
                }
            }else{
                response = 'user not found'
            }
        }

        res.send(response)

    })
})


//  Update User info route

server.post('/updateinfo', (req, res) => {
    var id = req.body.id;
    console.log("this is update user info req")
    console.log(req.body)

    User.findByIdAndUpdate(id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            phone: req.body.phone,
            about: req.body.about,
            city: req.body.city,
            country: req.body.country,
            address: req.body.address,
        }
    }, { new: true }, (err, data) => {
        if (err)
            console.log(err)
        else
            res.send(data)
    })
})

//Update Ad route
server.post('/editad', (req, res) => {

    console.log("This is update ad request");
    console.log(req.body);
    Post.findByIdAndUpdate(req.body.id,
        {
            $set: {
                sellerCountry: req.body.sellerCountry,
                adTitle: req.body.adTitle,
                brand: req.body.brand,
                category: req.body.category,
                condition: req.body.condition,
                price: req.body.price,
                location: req.body.location,
                description: req.body.description,
                sellerId: req.body.sellerId,
                sellerImg: req.body.sellerImg,
                sellerName: req.body.sellerName,
                phone: req.body.phone,
                date: req.body.date,
                url1: req.body.url1,
                url2: req.body.url2,
                url3: req.body.url3,
                url4: req.body.url4
            }
        }, (err, data) => {
            if (err)
                console.log(err)
            else
                console.log(data)
            res.send(data);
        })
})


//Add Favorite Ads Route
server.post('/markfavorite', async (req, res) => {

    console.log("This is favorite req ");
    var id = req.body.user._id
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            console.log('user found')
            user.favorites.push(req.body.id);
            user.markModified('favorites');
            await user.save();
            res.send(user);
        }
    } catch (error) {
        console.log(error);
    }

})



//Remove Favorite Ads Route
server.post('/removefavorite', async (req, res) => {

    console.log("This is remove favorite req ");
    var id = req.body.user._id

    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            user.favorites.pull(req.body.id);
            user.markModified('favorites');
            await user.save();
            res.send(user);
        }
    } catch (error) {
        console.log(error);
    }

})


// Delete User Route

server.post('/deleteuser', (req, res) => {
    var id = req.body.id;

    User.findByIdAndRemove(id, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log('User Delted')
        res.send(data)

    })
})

//Delete Ad Route
server.post('/deletead', (req, res) => {
    console.log("this is delete ad request")
    // console.log(req.body.adToDelete)
    var id = req.body.adToDelete
    console.log(id)
    Post.findByIdAndDelete(id, (err, data) => {
        if (err)
            console.log(err)
        else
            console.log('Add deleted')
        res.send(data)
    })
})



server.post('/currentad', (req, res) => {
    // console.log(req.body)
    // console.log("This is current add req")

    id = req.body.id

    Post.findById(id, (err, data) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else
            res.send(data)
        // console.log(data)
    })
})
server.get('/get-room/:person1/:person2', async (req, res) => {
    try {
        const { person1, person2 } = req.params;
        const room = await Room.findOne({ $or: [{ person1, person2 }, { person1: person2, person2: person1 }] });
        if (room) {
            res.status(200).json(room);
        } else {
            const newRoom = new Room({ person1, person2 });
            await newRoom.save();
            res.status(200).json(room);
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})
server.get('/get-rooms/:userId', async (req, res) => {
    try {
        const rooms = await Room.find({ $or: [{ person1: req.params.userId }, { person2: req.params.userId }] }).populate('person1 person2');
        res.status(200).json(rooms);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})
var http = require("http");
const { Socket } = require('dgram');
const { response } = require('express');

var app = http.createServer(server);
var io = require("socket.io")(app);



//Socket.IO code
io.sockets.on('connect', (socket) => {
    console.log(socket.id)

    socket.on('new user', async (userID) => {
        try {
            await OnlineUsers.update({ user: userID }, { $set: { user: userID, socketId: socket.id } }, { upsert: true });
        } catch (error) {
            console.log(error);
        }
    })

    //on Disconnect
    socket.on('disconnect', async (data) => {
        console.log("data", data, socket.id);
        try {
            await OnlineUsers.deleteOne({ socketId: socket.id });
        } catch (error) {
            console.log(error);
        }
    })


});



const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server is running at port ${PORT}`))