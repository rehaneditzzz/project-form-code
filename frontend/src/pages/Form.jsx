import  { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const formSchema = z.object({
  firstname: z.string().min(2, "First name must have at least 2 characters"),
  lastname: z.string().min(2, "Last name must have at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(10, "Address must be at least 10 characters long"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  dob: z.string().min(1, "Date of Birth is required"),
  placeOfBirth: z.string().min(3, "Place of birth must have at least 3 characters"),
  photo: z
    .any()
    .refine(
      (file) => file && file[0]?.type.startsWith("image/"),
      "Please upload a valid image file"
    ),
});

const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("dob", data.dob);
      formData.append("placeOfBirth", data.placeOfBirth);
      formData.append("photo", data.photo[0]); // Photo file upload

      await axios.post("http://localhost:5000/form", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Student added successfully!");

      setTimeout(()=>{
        setSuccessMessage("");
        reset();
      },2000)
      console.log([...formData.entries()]);

    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 p-5">
      <h1 className="text-2xl text-purple-800 font-bold">Add New Student</h1>
      <div className="bg-white p-6 mt-4 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Firstname */}
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                {...register("firstname")}
                className={`w-full border p-2 rounded ${
                  errors.firstname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
            </div>

            {/* Lastname */}
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                {...register("lastname")}
                className={`w-full border p-2 rounded ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full border p-2 rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea
                {...register("address")}
                className={`w-full border p-2 rounded ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                {...register("phone")}
                type="tel"
                className={`w-full border p-2 rounded ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                {...register("dob")}
                type="date"
                className={`w-full border p-2 rounded ${
                  errors.dob ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-sm font-medium">Place of Birth</label>
              <input
                {...register("placeOfBirth")}
                className={`w-full border p-2 rounded ${
                  errors.placeOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.placeOfBirth && <p className="text-red-500 text-xs">{errors.placeOfBirth.message}</p>}
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium">Photo</label>
              <input
                {...register("photo")}
                type="file"
                className={`w-full border p-2 rounded ${
                  errors.photo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.photo && <p className="text-red-500 text-xs">{errors.photo.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full bg-purple-600 text-white p-3 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Form;
