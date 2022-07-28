require('dotenv').config();
const express = require('express');
const app = express();
const port  = 8888;
console.log(process.env.CLIENT_ID);
app.get('/',(req,res)=>{
    res.send("Hello user");
    
})

app.listen(port,()=>{
    console.log(`App listening at port ${port}`)
})