import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Zod Schema Validation here
const SignupSchema = z.object({
  username: z.string().min(2, "Username must have at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(2, "Password must have at least 2 characters"),
});

const SignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:5000/signup", data);

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      setSuccessMessage("Account Created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        reset();
        navigate("/form"); // Redirect to the student form page
      }, 2000);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="w-full max-w-sm h-[450px] p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              {...register("username")}
              className={`w-full p-2 mt-1 border rounded-md border-gray-300 outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full p-2 mt-1 border rounded-md border-gray-300 outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className={`w-full p-2 mt-1 mb-4 border rounded-md border-gray-300 outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full bg-purple-600 text-white p-3 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        
          <p className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?
          <a href="/" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
        
        </form>
        

        {successMessage && (
          <p className="text-green-600 mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
