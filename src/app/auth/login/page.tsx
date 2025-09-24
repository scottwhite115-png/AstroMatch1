'use client'

import React, { useState } from "react";
import Logo from "@/components/Logo";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Connect to Supabase or backend later
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-start"
      style={{
        background: 'linear-gradient(to top, #fef3c7, #fce7f3, #1e40af)',
        minHeight: '100vh',
        width: '100vw'
      }}
    >
      {/* Logo + slogan */}
      <div className="mt-12 text-center">
        <Logo />
        <p className="font-semibold text-lg" style={{ color: '#ff7a00', marginTop: '0px', marginLeft: '90px' }}>
          Find harmony in the stars
        </p>
      </div>

      {/* Login form */}
      <div className="w-full flex justify-center" style={{ marginTop: '60px' }}>
        <div className="w-80">
          <form onSubmit={handleSubmit}>
            <div>
              {/* Name */}
              <div style={{ marginBottom: '30px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ff7a00]"
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '30px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ff7a00]"
                />
              </div>

              {/* Date of Birth */}
              <div style={{ marginBottom: '30px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ff7a00]"
                />
              </div>

              {/* Gender */}
              <div style={{ marginBottom: '30px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex justify-between px-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#ff7a00] text-white font-semibold py-2 hover:opacity-90 transition"
                >
                  Save & continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}