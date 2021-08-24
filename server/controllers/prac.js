//aap.js

const express = require("express");
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const placesRoute = require("<file path>")

app.use("/api/places",placesRoute);

//error handling
app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code||500);
    res.json({message:error.message}||{message:"something went wrong"});
})

app.listen(5000,()=>{console.log("statred");})

//placeRouters.js

const express = require("express");
const router = express.Router();

router.get("/:pid",(req,res,next)=>{
    const placeId = req.params.pod;
    const data;
    if(!data){
        return next()
    }
})

