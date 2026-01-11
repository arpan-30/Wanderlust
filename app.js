if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const mongoose=require("mongoose");


const User=require("./models/user.js");
const ExpressError=require("./utils/ExpressError.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connection was successfully ceated to DATABASE..");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

let port=3030;

app.listen(port,()=>{
    console.log(`App is listening on port number:${port}`);
});

const store=MongoStore.create({
     mongoUrl:dbUrl,
     crypto:{
        secret:process.env.SESSION_SECRET,
     },
     touchAfter:24*3600,
});

store.on("error", (e) => {
    console.log("SESSION STORE ERROR", e);
});


const sessionOptions={
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        // we set expiry after a week and this valuse is passed in millisecond
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};




// app.get("/",(req,res)=>{
//     res.send("Working");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    // console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student1@gmail.com",
//         username:"delta-",
//     });

//     let registerdUser=await User.register(fakeUser,"helloworld123");
//     res.send(registerdUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
    // next(err);
});



app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong!"}=err;
    // res.send("Something went wrong...!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs",{message});
});
