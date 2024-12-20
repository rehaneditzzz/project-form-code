import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import axios from 'axios';

// Zod schema validation
const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(2, "Password must have at least 2 characters"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  // Check if token is already in localStorage and redirect if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, redirect to student form or dashboard
      navigate('/form');
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/login", data);

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      setTimeout(() => {
        navigate('/student-form'); // Redirect to student form after login
      }, 2000);
    } catch (error) {
      setErrorMessage('Invalid credentials');
      console.error("Error logging in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="w-full max-w-sm h-[450px] p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-400 text-center"> Create an Account {" "} <a href="/signup" className="text-blue-500 hover:underline"> Sign up </a> </p>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
