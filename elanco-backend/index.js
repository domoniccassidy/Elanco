import express,{json,urlencoded} from "express";
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import users from "./routes/UserRoute.js"

dotenv.config();

const app = express()
app.use(cors())
app.use(json({limit:"30mb",extended:true}))
app.use(urlencoded({ limit: "30mb", extended: true }));


app.use("/users",users)

const PORT = process.env.PORT
const CONNECTION_STRING =  process.env.CONNECTION_STRING


mongoose.connect(CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    app.listen(PORT,() =>{
        console.log(`Server listening on port ${PORT}`);
    })
})

