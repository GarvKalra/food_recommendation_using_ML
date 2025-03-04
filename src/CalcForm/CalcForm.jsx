// import React, { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import confetti from "canvas-confetti";
// import { useNavigate } from "react-router-dom";

// function CalcForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     height: "",
//     weight: "",
//     activityLevel: "",
//     age: "",
//     gender: "male",
//     userId: "user123",
//     weightGoal: 0, // Default weight goal (0 means maintain weight)
//   });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await fetch("http://localhost:5000/api/calculateGoal", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(formData),
// //       });

// //       const data = await response.json();
// //       if (data.success) {
// //         console.log(data);
// //         toast.success("Data saved successfully! 🎉", {
// //           position: "top-right",
// //           autoClose: 3000,
// //           hideProgressBar: false,
// //           closeOnClick: true,
// //           pauseOnHover: true,
// //           draggable: true,
// //           progress: undefined,
// //         });

// //         // Trigger confetti effect
// //         confetti({
// //           particleCount: 100,
// //           spread: 70,
// //           origin: { y: 0.6 },
// //         });
// //       } else {
// //         toast.error("Error saving data. Please try again. 😢", {
// //           position: "top-right",
// //           autoClose: 3000,
// //           hideProgressBar: false,
// //           closeOnClick: true,
// //           pauseOnHover: true,
// //           draggable: true,
// //           progress: undefined,
// //         });
// //       }

// //       setTimeout(() => {
// //         navigate("/");
// //       }, 4000);
// //     } catch (error) {
// //       console.error("Error:", error);
// //       toast.error("Something went wrong. Please try again. 😢", {
// //         position: "top-right",
// //         autoClose: 3000,
// //         hideProgressBar: false,
// //         closeOnClick: true,
// //         pauseOnHover: true,
// //         draggable: true,
// //         progress: undefined,
// //       });
// //     }
// //   };




// const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/api/calculate-goals", {
//         method: "POST",
//         headers: {
//             "Authorization":`Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
  
//       const text = await response.text(); // Log raw response
//       console.log("Raw response:", text);
  
//       try {
//         const data = JSON.parse(text); // Convert to JSON
//         console.log("Parsed JSON:", data);
  
//         if (data.success) {
//           toast.success("Data saved successfully! 🎉", {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
  
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         } else {
//           toast.error("Error saving data. Please try again. 😢", {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//         }
  
//         setTimeout(() => {
//           navigate("/home");
//         }, 4000);
//       } catch (jsonError) {
//         console.error("JSON Parsing Error:", jsonError);
//         console.error("Response received:", text); // Log full response
//         toast.error("Invalid server response. Please try again.", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       toast.error("Something went wrong. Please try again. 😢", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };
  





//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSliderChange = (e) => {
//     setFormData({ ...formData, weightGoal: parseFloat(e.target.value) });
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-green-500 transform transition-transform hover:scale-105">
//         <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">
//           Welcome to Nourish! 🌱
//         </h1>
//         <p className="text-gray-400 text-center mb-8">
//           Let's get started by setting up your profile.
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Height */}
//           <div className="relative">
//             <label className="block text-gray-400 text-sm mb-2">Height (cm)</label>
//             <input
//               name="height"
//               type="number"
//               value={formData.height}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 border-2 border-green-500 focus:border-green-300 focus:outline-none transition-colors"
//               placeholder="Enter your height"
//             />
//           </div>

//           {/* Weight */}
//           <div className="relative">
//             <label className="block text-gray-400 text-sm mb-2">Weight (kg)</label>
//             <input
//               name="weight"
//               type="number"
//               value={formData.weight}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 border-2 border-green-500 focus:border-green-300 focus:outline-none transition-colors"
//               placeholder="Enter your weight"
//             />
//           </div>

//           {/* Activity Level */}
//           <div className="relative">
//             <label className="block text-gray-400 text-sm mb-2">Activity Level</label>
//             <select
//               name="activityLevel"
//               value={formData.activityLevel}
//               onChange={handleChange}
//               className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 border-2 border-green-500 focus:border-green-300 focus:outline-none transition-colors"
//             >
//               <option value="1.2">Sedentary (Little to no exercise)</option>
//               <option value="1.375">Lightly Active (1-3 days/week exercise)</option>
//               <option value="1.55">Moderately Active (3-5 days/week exercise)</option>
//               <option value="1.725">Very Active (6-7 days/week exercise)</option>
//               <option value="1.9">Super Active (Athlete, intense training)</option>
//             </select>
//           </div>

//           {/* Age */}
//           <div className="relative">
//             <label className="block text-gray-400 text-sm mb-2">Age</label>
//             <input
//               name="age"
//               type="number"
//               value={formData.age}
//               onChange={handleChange}
//               required
//               className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 border-2 border-green-500 focus:border-green-300 focus:outline-none transition-colors"
//               placeholder="Enter your age"
//             />
//           </div>

//           {/* Gender */}
//           <div className="relative">
//             <label className="block text-gray-400 text-sm mb-2">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 border-2 border-green-500 focus:border-green-300 focus:outline-none transition-colors"
//             >
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>

//           {/* Weight Goal Slider */}
//           <div className="relative">
//             <label className="block text-gray-400 text-sm mb-2">
//               Weekly Weight Goal (kg/week)
//             </label>
//             <input
//               name="weightGoal"
//               type="range"
//               min="-0.5"
//               max="0.5"
//               step="0.25"
//               value={formData.weightGoal}
//               onChange={handleSliderChange}
//               className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 border-2 border-green-500 focus:border-green-300 focus:outline-none transition-colors"
//             />
//             <div className="text-gray-400 text-sm mt-2">
//               {formData.weightGoal === 0
//                 ? "Maintain Weight"
//                 : formData.weightGoal > 0
//                 ? `Gain ${formData.weightGoal} kg/week`
//                 : `Lose ${Math.abs(formData.weightGoal)} kg/week`}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-green-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
//           >
//             Calculate My Goals 🚀
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CalcForm;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, Activity, Heart, Scale, Ruler } from "lucide-react";
import confetti from "canvas-confetti";

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const CalcForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    activityLevel: "1.2",
    age: "",
    gender: "male",
    userId: "user123",
    weightGoal: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["basics", "activity", "goals"];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (isSubmitting) return;
    
  //   setIsSubmitting(true);
    
  //   try {
  //     const response = await fetch("http://localhost:5000/api/calculate-goals", {
  //       method: "POST",
  //       headers: {
  //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });
  
  //     const text = await response.text();
  //     console.log("Raw response:", text);
  
  //     try {
  //       const data = JSON.parse(text);
  //       console.log("Parsed JSON:", data);
  
  //       if (data.success) {
  //         const canvas = document.createElement("canvas");
  //         canvas.style.position = "fixed";
  //         canvas.style.inset = "0";
  //         canvas.style.width = "100vw";
  //         canvas.style.height = "100vh";
  //         canvas.style.zIndex = "100";
  //         canvas.style.pointerEvents = "none";
  //         document.body.appendChild(canvas);
          
  //         // const confetti = new (window as any).ConfettiGenerator({
  //         //   target: canvas,
  //         //   max: 80,
  //         //   size: 1.5,
  //         //   animate: true,
  //         //   respawn: false,
  //         //   props: ["circle", "square"],
  //         //   colors: [[46, 204, 113], [39, 174, 96], [0, 230, 64], [0, 177, 106]],
  //         //   clock: 25,
  //         // });


  //         const confetti = new window.ConfettiGenerator({
  //           target: canvas,
  //           max: 80,
  //           size: 1.5,
  //           animate: true,
  //           respawn: false,
  //           props: ["circle", "square"],
  //           colors: [[46, 204, 113], [39, 174, 96], [0, 230, 64], [0, 177, 106]],
  //           clock: 25,
  //         });



          
  //         confetti.render();
          
  //         toast.success("Your wellness plan is ready!", {
  //           description: "Redirecting you to your personalized dashboard.",
  //           duration: 4000,
  //         });
          
  //         setTimeout(() => {
  //           document.body.removeChild(canvas);
  //           navigate("/home");
  //         }, 4000);
  //       } else {
  //         toast.error("Something went wrong", {
  //           description: "Please try again or contact support.",
  //           duration: 4000,
  //         });
  //       }
  //     } catch (jsonError) {
  //       console.error("JSON Parsing Error:", jsonError);
  //       toast.error("Invalid server response", {
  //         description: "Please try again later.",
  //         duration: 4000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     toast.error("Connection error", {
  //       description: "Unable to reach the server. Please try again.",
  //       duration: 4000,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/calculate-goals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const text = await response.text(); // Log raw response
      console.log("Raw response:", text);
  
      try {
        const data = JSON.parse(text); // Convert to JSON
        console.log("Parsed JSON:", data);
  
        if (data.success) {
          // Trigger confetti effect using canvas-confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
  
          toast.success("Data saved successfully! 🎉", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
  
          setTimeout(() => {
            navigate("/home");
          }, 4000);
        } else {
          toast.error("Error saving data. Please try again. 😢", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError);
        console.error("Response received:", text); // Log full response
        toast.error("Invalid server response. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Something went wrong. Please try again. 😢", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, weightGoal: parseFloat(e.target.value) });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="form-field">
        <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
          <Ruler className="w-4 h-4 mr-2 text-green-500" />
          Height (cm)
        </label>
        <input
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
          required
          className="w-full bg-gray-900 text-white rounded-lg py-3 px-4 border border-green-500 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none transition-all"
          placeholder="Enter your height"
        />
      </div>

      <div className="form-field">
        <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
          <Scale className="w-4 h-4 mr-2 text-green-500" />
          Weight (kg)
        </label>
        <input
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          required
          className="w-full bg-gray-900 text-white rounded-lg py-3 px-4 border border-green-500 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none transition-all"
          placeholder="Enter your weight"
        />
      </div>

      <div className="form-field">
        <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
          <Heart className="w-4 h-4 mr-2 text-green-500" />
          Age
        </label>
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          required
          className="w-full bg-gray-900 text-white rounded-lg py-3 px-4 border border-green-500 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none transition-all"
          placeholder="Enter your age"
        />
      </div>

      <div className="form-field">
        <label className="block text-gray-400 text-sm font-medium mb-2">Gender</label>
        <div className="flex gap-4">
          <div
            className={`flex-1 py-3 px-4 rounded-lg border cursor-pointer transition-all ${
              formData.gender === "male"
                ? "border-green-500 bg-green-500/10 text-white"
                : "border-gray-700 bg-gray-800 text-gray-400"
            }`}
            onClick={() => setFormData({ ...formData, gender: "male" })}
          >
            <div className="flex items-center justify-center">
              <span>Male</span>
            </div>
          </div>
          <div
            className={`flex-1 py-3 px-4 rounded-lg border cursor-pointer transition-all ${
              formData.gender === "female"
                ? "border-green-500 bg-green-500/10 text-white"
                : "border-gray-700 bg-gray-800 text-gray-400"
            }`}
            onClick={() => setFormData({ ...formData, gender: "female" })}
          >
            <div className="flex items-center justify-center">
              <span>Female</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="form-field">
        <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-green-500" />
          Activity Level
        </label>
        <div className="space-y-3">
          {[
            { value: "1.2", label: "Sedentary", description: "Little to no exercise" },
            { value: "1.375", label: "Lightly Active", description: "1-3 days/week exercise" },
            { value: "1.55", label: "Moderately Active", description: "3-5 days/week exercise" },
            { value: "1.725", label: "Very Active", description: "6-7 days/week exercise" },
            { value: "1.9", label: "Super Active", description: "Athlete, intense training" },
          ].map((option) => (
            <div
              key={option.value}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                formData.activityLevel === option.value
                  ? "border-green-500 bg-green-500/10 shadow-sm"
                  : "border-gray-700 bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => setFormData({ ...formData, activityLevel: option.value })}
            >
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full mr-3 ${
                  formData.activityLevel === option.value
                    ? "bg-green-500" 
                    : "bg-gray-600"
                }`}>
                  {formData.activityLevel === option.value && (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-sm text-gray-400">{option.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoalInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="form-field">
        <label className="block text-gray-400 text-sm font-medium mb-2">
          Weekly Weight Goal (kg/week)
        </label>
        <div className="mt-6 mb-8 px-3">
          <input
            name="weightGoal"
            type="range"
            min="-0.5"
            max="0.5"
            step="0.25"
            value={formData.weightGoal}
            onChange={handleSliderChange}
            className="w-full"
            style={{
              background: "linear-gradient(to right, #22c55e, #22c55e)",
              height: "4px",
              borderRadius: "4px"
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-400 px-1 mt-2">
            <span>Lose 0.5kg</span>
            <span>Maintain</span>
            <span>Gain 0.5kg</span>
          </div>
        </div>
        
        <div className="mt-8 mb-4">
          <div className="text-center">
            <div className="inline-block py-2 px-6 rounded-full bg-green-500/20 text-green-500 font-medium">
              {formData.weightGoal === 0
                ? "Maintain Current Weight"
                : formData.weightGoal > 0
                ? `Gain ${formData.weightGoal} kg/week`
                : `Lose ${Math.abs(formData.weightGoal)} kg/week`}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm text-center mt-4">
            Based on your goals, we'll calculate your daily calorie and nutrient targets.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div 
        className="max-w-md w-full mx-auto rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-green-500/30 animate-scale-in"
        style={{
          boxShadow: "0 10px 40px -10px rgba(34, 197, 94, 0.3), 0 8px 16px -4px rgba(0, 0, 0, 0.3)"
        }}
      >
        <div className="p-8">
          <header className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10 mb-4">
              <div className="text-green-500 text-xl font-semibold">N</div>
            </div>
            <h1 className="text-2xl font-bold text-white">Personalize Your Journey</h1>
            <p className="text-gray-400 mt-2">
              {currentStep === 0 ? "Let's get to know you better" : 
               currentStep === 1 ? "Tell us about your activity level" :
               "Set your personal goals"}
            </p>
          </header>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div 
                    className={`flex flex-col items-center ${
                      index <= currentStep ? "text-green-500" : "text-gray-600"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      index < currentStep 
                        ? "bg-green-500 text-black" 
                        : index === currentStep
                        ? "border-2 border-green-500 text-green-500" 
                        : "border border-gray-600 text-gray-600"
                    }`}>
                      {index < currentStep ? "✓" : index + 1}
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-700"
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 0 && renderBasicInfo()}
            {currentStep === 1 && renderActivityInfo()}
            {currentStep === 2 && renderGoalInfo()}

            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-black font-medium flex items-center transition-colors"
                >
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-black font-medium flex items-center transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Calculate My Plan"}
                  {!isSubmitting && <ChevronRight className="ml-1 h-4 w-4" />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalcForm;