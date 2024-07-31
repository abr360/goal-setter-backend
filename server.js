const express=require('express');
const dotenv=require('dotenv').config();
const colors=require('colors');
const connectDB=require('./config/db');
const port=process.env.PORT || 8000;
connectDB();
const app=express();
app.use(express.json());
const { errorHandler } = require('./middleware/errorMiddleWare');
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(express.urlencoded({extended:false}));
app.use(errorHandler);

app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT,()=>{
    console.log(`Server is running on port ${process.env.X_ZOHO_CATALYST_LISTEN_PORT}`);
});