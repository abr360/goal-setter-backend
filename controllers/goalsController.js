const asyncHandler = require('express-async-handler');
const Goal = require('../model/goalModel');
const User = require('../model/userModel');
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).json(goals);
});
const postGoals = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.text) {
        res.status(400);
        throw new Error('Request body or text property is missing');
    }
    const createdGoal = await Goal.create({
        text: req.body.text,
        user: req.user._id,
    });
    res.status(201).json(createdGoal);
});

const putGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }
    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this goal');
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedGoal);
});


const deleteGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }
    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this goal');
    }
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Goal with id ${req.params.id} deleted` });
});

module.exports = { getGoals, postGoals, putGoals, deleteGoals };
