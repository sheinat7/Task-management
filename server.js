const express = require ('express');
const dotenv = require ('dotenv');
const cors = require ('cors');
const connectDB = require ('./config/db');
const path = require ('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRouter');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join
    (__dirname, 'uploades')));

    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);

    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => console.log (`Server running on port 
        ${PORT}`)); 