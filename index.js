const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/Db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cookie = require("cookie-parser")

const app = express();
app.use(cookie());
app.use(express.json());

app.use(bodyParser.json());
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/hello",(req,res)=>{
    res.send("hello")
})