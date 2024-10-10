const Task = require('../models/Task');


const createTask = async (req, res) => {
    const { title, description } = req.body;
    console.log("here")
    try {
        const task = await Task.create({
            user: req.user._id,
            title,
            description,
        });
        res.status(201).json(task);
    } catch (error) {
        console.error("There is an error", error);
        res.status(500).json({ message: error.message });
    }
};


const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed ?? task.completed;
        task.future = req.body.future ?? task.future;
        task.priority = req.body.priority ?? task.priority;
        task.favorite = req.body.favorite ?? task.favorite;
       
        const updatedTask = await task.save();
        
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteTask = async (req, res) => {
    try {
        console.log("Here Delete")
        const task = await Task.findById(req.params.id);
        console.log("task", task)
        if (task.user.toString() !== req.user._id.toString()) {
            console.log("Un Authorized!")
            return res.status(401).json({ message: 'Not authorized' });
        }
        console.log("Almost deleted")
        await task.deleteOne();
        console.log("Maybe the problem is here?, Solved")
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, getTask };