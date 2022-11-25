const app=require("express")();
const server = require('http').createServer(app);
const io=require("socket.io")(server,{
    cors:{
        origin: "*",
    },
});

io.on("connection",(socket)=>{
   console.log("Socket",socket);
   console.log("Ready to connect");

   socket.on("chat",(payload)=>{
    console.log("payload",payload);
    io.emit("chat",payload)
   })

   socket.on("send-stream", (ref) => {
    console.log(ref);
  });

})

server.listen(8000,()=>{
    console.log("server is running");
})
