import express from 'express'
import { Recipemodel } from "../models/Recipes.js";
import { Usermodel } from '../models/Users.js';
import { verifyToken } from './users.js';

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const response = await Recipemodel.find({});
        res.json(response);
    } catch (err) {
        res.json(err)
    }
})

router.post("/", verifyToken, async (req, res) => {
    const recipe = new Recipemodel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.json(err)
    }
})


router.put("/", verifyToken, async (req, res) => {
    
    try {
        const recipe = await Recipemodel.findById(req.body.recipeID);
        const user = await Usermodel.findById(req.body.userID);

        user.savedRecipes.push(recipe);
        await user.save();
        res.json({savedRecipes: user.savedRecipes});
    } catch (err) {
        res.json(err)
    }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await Usermodel.findById(req.params.userID)
        res.json({savedRecipes: user?.savedRecipes})
    } catch (err) {
        res.json(err);
    }
});

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await Usermodel.findById(req.params.userID);
        const savedRecipes = await Recipemodel.find({
            _id: { $in: user.savedRecipes }
        });
        res.json({savedRecipes});
    } catch (err) {
        res.json(err);
    }
});



export { router as recipesRouter }




