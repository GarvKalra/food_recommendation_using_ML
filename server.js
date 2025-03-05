require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserDetails = require("./models/userDetails");
const userModel = require("./models/user");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware/auth");
const Food = require("./models/selectedFood");
const axios = require("axios");
const DailyIntake = require('./models/dailyIntake.js');

const port = 5000;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    credentials: true, // Allow cookies/sessions with requests
  })
);
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

// Helper Functions
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
};

const calculateMaintenanceCalories = (weight, height, age, gender, activityLevel) => {
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return Math.round(bmr * activityLevel);
};

const calculateDailyMacros = (weight, maintenanceCalories) => {
  const protein = Math.round(weight * 1); // 1g protein/kg body weight
  const fats = Math.round((maintenanceCalories * 0.25) / 9); // 25% of calories from fats
  const carbs = Math.round((maintenanceCalories - (protein * 4 + fats * 9)) / 4); // Remaining calories from carbs
  const fiber = Math.round((maintenanceCalories / 1000) * 14); // 14g fiber per 1000 calories
  return { protein, carbs, fats, fiber };
};

// Routes
app.post("/signup", async (req, res) => {
  try {
    let { firstname, lastname, contact, username, email, password } = req.body;
    let existinguser = await userModel.findOne({ email });
    if (existinguser) {
      return res.status(400).send("User already exists");
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ firstname, lastname, contact, username, email, password: hashed });
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
  }
});


app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).send({ error: "Invalid Password" });
    }
    
    // Check if user details exist
    const userDetails = await UserDetails.findOne({ userId: user._id });
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.send({ 
      message: "Login Successful", 
      token: token, 
      userId: user._id,
      hasUserDetails: !!userDetails // Boolean indicating if user details exist
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Server error" });
  }
});



app.post("/api/calculate-goals", authMiddleware, async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, weightGoal } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!height || !weight || !age || !gender || !activityLevel || !weightGoal) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Calculate BMI
    const bmi = calculateBMI(weight, height);

    // Calculate Maintenance Calories
    const maintenanceCalories = calculateMaintenanceCalories(weight, height, age, gender, activityLevel);

    // Adjust Calories Based on Weight Goal
    const adjustedCalories = maintenanceCalories + (weightGoal * 7700) / 7;

    // Calculate Daily Macros
    const dailyMacros = calculateDailyMacros(weight, adjustedCalories);

    // Check if user details already exist, then update, else create new
    const updatedUserDetails = await UserDetails.findOneAndUpdate(
      { userId }, // Find user by userId
      {
        height,
        weight,
        age,
        gender,
        activityLevel,
        weightGoal,
        bmi,
        maintenanceCalories: adjustedCalories,
        dailyMacros,
      },
      { new: true, upsert: true } // If not found, create a new one
    );

    res.status(200).json({ success: true, message: "Goals updated successfully!", userDetails: updatedUserDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

app.use(express.static("public"));



app.post('/api/add-food', async (req, res) => {
  try {
    // Validate incoming data
    const { 
      userId, 
      food_name, 
      protein_g, 
      carb_g, 
      fat_g, 
      fibre_g, 
      energy_kcal, 
      glycemic_index 
    } = req.body;

    // Validation checks
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create new food entry
    const newFood = new Food({
      userId,
      food_name,
      protein_g,
      carb_g,
      fat_g,
      fibre_g,
      energy_kcal,
      glycemic_index
    });

    // Save to database
    const savedFood = await newFood.save();

    res.status(201).json(savedFood);
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
});


app.get("/api/selected-food", authMiddleware, async (req, res) => {
  try {
    const foods = await Food.find({ userId: req.user.userId });
    res.json(foods);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching foods" });
  }
});

app.get("/api/latest-food/:userId", authMiddleware, async (req, res) => {
  try {
    const latestfood = await Food.findOne({ userId: req.user.userId }).sort({ _id: -1 });
    if (!latestfood) {
      return res.status(404).json({ message: "No food found" });
    }
    res.json(latestfood);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


app.post("/api/analyze", async (req, res) => {
  try {
    const { food } = req.body;
    console.log("🔍 Received Food Search:", food);

    if (!food) {
      console.error("❌ No food name provided");
      return res.status(400).json({ message: "Food name is required" });
    }

    // Fallback nutrition data for common foods
    const nutritionFallback = {
      apple: {
        calorie: 52,
        carb: 14,
        protein: 0.3,
        fat: 0.2,
        fiber: 2.4,
        glycemic_index: 36
      },
      banana: {
        calorie: 89,
        carb: 22.8,
        protein: 1.1,
        fat: 0.3,
        fiber: 2.6,
        glycemic_index: 51
      },
      chicken: {
        calorie: 165,
        carb: 0,
        protein: 31,
        fat: 3.6,
        fiber: 0,
        glycemic_index: null
      }
    };

    // Check if food is in fallback database
    if (nutritionFallback[food.toLowerCase()]) {
      console.log("✅ Using Fallback Nutrition Data");
      return res.json({
        food: food,
        ...nutritionFallback[food.toLowerCase()]
      });
    }

    // Only attempt LLM call if not in fallback
    try {
      const response = await axios.post(
        "https://api.together.xyz/v1/chat/completions",
        {
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          messages: [
            {
              role: "system",
              content: "You are a nutrition expert. Return nutrition facts per 100g in strict JSON format."
            },
            {
              role: "user",
              content: `Provide nutrition facts per 100g of ${food} in this JSON format: {"calories":0,"carbs":0,"protein":0,"fat":0,"fiber":0,"glycemic_index":null}`
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🌐 Full API Response:", JSON.stringify(response.data, null, 2));

      // Extract the JSON content from the response
      const nutritionText = response.data.choices[0].message.content.trim();
      console.log("📄 Raw LLM Response:", nutritionText);

      // Parse the nutrition data
      let nutritionData;
      try {
        nutritionData = JSON.parse(nutritionText);
        console.log("✅ Parsed Nutrition Data:", nutritionData);
      } catch (parseError) {
        console.error("❌ JSON Parsing Error:", parseError);
        console.error("Problematic Text:", nutritionText);
        
        // Fallback to default values if parsing fails
        nutritionData = {
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          fiber: 0,
          glycemic_index: null
        };
      }

      // Respond with nutrition data
      res.json({
        food: food,
        calorie: nutritionData.calories || 0,
        carb: nutritionData.carbs || 0,
        protein: nutritionData.protein || 0,
        fat: nutritionData.fat || 0,
        fiber: nutritionData.fiber || 0,
        glycemic_index: nutritionData.glycemic_index ?? null
      });

    } catch (llmError) {
      console.error("❌ LLM API Error:", llmError.response?.data || llmError.message);
      
      // Fallback to extremely basic nutrition data if LLM fails
      res.json({
        food: food,
        calorie: 50,
        carb: 10,
        protein: 1,
        fat: 1,
        fiber: 1,
        glycemic_index: null
      });
    }

  } catch (serverError) {
    console.error("🚨 Comprehensive Server Error:", serverError);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: serverError.message,
      details: serverError.toString()
    });
  }
});

app.get("/api/fetchGoal", authMiddleware, async (req, res) => {
  try {
    // Ensure the user is authenticated and userId is available
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch user details from the UserDetails collection
    const userDetails = await UserDetails.findOne({ userId: req.user.userId });

    if (!userDetails) {
      return res.status(404).json({ error: "User details not found" });
    }

    // Return the user's goals and details
    res.status(200).json({
      success: true,
      userDetails: {
        height: userDetails.height,
        weight: userDetails.weight,
        age: userDetails.age,
        gender: userDetails.gender,
        activityLevel: userDetails.activityLevel,
        weightGoal: userDetails.weightGoal,
        bmi: userDetails.bmi,
        maintenanceCalories: userDetails.maintenanceCalories,
        dailyMacros: userDetails.dailyMacros,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized access" });

    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized access" });

    const { firstname, lastname, contact } = req.body; // Match frontend field names

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { firstname, lastname, contact },
      { new: true, runValidators: true } // Ensure validation is applied
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// New Routes for Vitals
const Vitals = require("./models/vitals");
const { parse } = require("dotenv");




app.post("/api/vitals", authMiddleware, async (req, res) => {
  try {
    const { sugarReading, weightReading } = req.body;
    const userId = req.user.userId;

    if (!sugarReading || !weightReading) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find existing user details
    const existingUserDetails = await UserDetails.findOne({ userId });

    if (!existingUserDetails) {
      return res.status(404).json({ message: "User details not found. Please set up your profile first." });
    }

    // Recalculate maintenance calories and macros with new weight
    const maintenanceCalories = calculateMaintenanceCalories(
      weightReading, 
      existingUserDetails.height, 
      existingUserDetails.age, 
      existingUserDetails.gender, 
      existingUserDetails.activityLevel
    );

    // Adjust Calories Based on Weight Goal
    const adjustedCalories = maintenanceCalories + (existingUserDetails.weightGoal * 7700) / 7;

    // Recalculate Daily Macros
    const dailyMacros = calculateDailyMacros(weightReading, adjustedCalories);

    // Update user details with new weight, calories, and macros
    const updatedUserDetails = await UserDetails.findOneAndUpdate(
      { userId },
      {
        weight: weightReading,
        maintenanceCalories: adjustedCalories,
        dailyMacros: dailyMacros,
        bmi: calculateBMI(weightReading, existingUserDetails.height)
      },
      { new: true }
    );

    // Create new vitals entry
    const vitals = await Vitals.create({
      userId,
      sugarReading,
      weightReading,
    });

    res.status(201).json({ 
      success: true, 
      message: "Vitals added successfully!", 
      vitals,
      userDetails: updatedUserDetails
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});



app.get("/api/vitals", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const vitals = await Vitals.find({ userId });

    res.status(200).json({ success: true, vitals });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

app.post("/api/add-food-to-dashboard",authMiddleware,async (req,res)=>{
  try{
    const {energy_kcal,protein_g,carb_g,fat_g,fibre_g} = req.body;
    const userId = req.user.userId;

    let dailyIntake = await DailyIntake.findOne({
      userId,
      date : {
        $gte : new Date().setHours(0,0,0,0),
        $lt : new Date().setHours(23,59,59,999),
      }
    });

    if(!dailyIntake) {
      dailyIntake = await DailyIntake.create({userId});
    }
    dailyIntake.calories += parseFloat(energy_kcal)
    dailyIntake.nutrients.protein += parseFloat(protein_g)
    dailyIntake.nutrients.carbs += parseFloat(carb_g)
    dailyIntake.nutrients.fats += parseFloat(fat_g)
    dailyIntake.nutrients.fiber += parseFloat(fibre_g);

    await dailyIntake.save();
    res.json({success : true , message : "Food intake updated"})
  }
  catch(err){
    console.error(err)
    res.status(500).json({success : false , message : "Server error"})
  }
});

app.get("/api/dashboard-data",authMiddleware,async (req,res)=>{
  try{
    const userId = req.user.userId;
    const dailyIntake = await DailyIntake.findOne({
      userId,
      date : {
        $gte : new Date().setHours(0,0,0,0),
        $lte : new Date().setHours(23,59,59,999)
      }
    })

    if(!dailyIntake){
      return res.json({success : true , calories : 0, nutrients : {protein : 0,carbs : 0,fats : 0,fiber :0}});

    }
    res.json({success : true,
      calories : dailyIntake.calories,
      nutrients : dailyIntake.nutrients
    })
  }
  catch(err){
    console.error(err)
    res.status(500).json({success : false,message : "Server error"})
  }
})

// Add these routes to your existing server file

app.post("/api/vitals", authMiddleware, async (req, res) => {
  try {
    const { sugarReading, weightReading } = req.body;
    const userId = req.user.userId;

    if (!sugarReading || !weightReading) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new vitals entry
    const vitals = await Vitals.create({
      userId,
      sugarReading,
      weightReading,
    });

    // Update user details with the latest weight
    await UserDetails.findOneAndUpdate(
      { userId },
      { weight: weightReading },
      { new: true }
    );

    res.status(201).json({ 
      success: true, 
      message: "Vitals added successfully!", 
      vitals 
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

app.get("/api/vitals", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Fetch all vitals for the user, sorted by timestamp
    const vitals = await Vitals.find({ userId }).sort({ timestamp: -1 });

    // Optional: Get the latest vitals for quick reference
    const latestVitals = vitals.length > 0 ? vitals[0] : null;

    res.status(200).json({ 
      success: true, 
      vitals,
      latestVitals
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Live at port ${port}`);
});