const express= require("express")
const http=require("http")
const path = require("path")
const {v4:uuidV4}=require("uuid")

const app=express()
const server=http.createServer(app);
const io=require("socket.io")(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));


app.get("/",(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})

app.get("/:room",(req,res)=>{
    res.render("room",{roomId:req.params.room})
})

io.on("connection",socket=>{
    // console.log(socket);
    socket.on("join-room",(roomId,userId)=>{
        // console.log(roomId,userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected",userId);
        socket.on("disconnect",()=>{
            socket.broadcast.to(roomId).emit("user-disconnected",userId);
        })
    })
    
})


const Port=process.env.PORT || 3000

server.listen(Port,()=>{
    console.log("Server Started");
})