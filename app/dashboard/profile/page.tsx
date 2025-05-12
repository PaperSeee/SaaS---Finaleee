"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || "",
    companyName: user?.user_metadata?.company_name || "",
    phone: user?.user_metadata?.phone || "",
    avatarUrl: user?.user_metadata?.avatar_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          company_name: formData.companyName,
          phone: formData.phone,
        }
      });

      if (error) throw error;
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError((err as Error).message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user?.id}-${Date.now()}.${fileExt}`;
    
    setLoading(true);
    setError("");
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      if (!data.publicUrl) throw new Error("Could not get public URL");
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });
      
      if (updateError) throw updateError;
      
      setFormData(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      setSuccess("Profile picture updated");
    } catch (error: unknown) {
      const typedError = error as { message: string };
      console.error("Avatar upload error:", typedError.message);
      setError(typedError.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gradient-to-tr from-gray-50 to-blue-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              My Profile
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>
          
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 flex items-start">
              <svg className="h-5 w-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="ml-3 text-sm text-green-700">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
              <p className="mt-1 text-sm text-gray-500">Update your personal details and company information</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="relative h-24 w-24">
                    <div className="h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                      {formData.avatarUrl ? (
                        <Image 
                          src={formData.avatarUrl} 
                          alt="Profile" 
                          width={100} 
                          height={100}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500 text-2xl font-semibold">
                          {formData.name.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <label htmlFor="avatar-upload" className="absolute -right-2 -bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="sr-only">Change profile picture</span>
                    </label>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-medium text-gray-900">{formData.name || "User"}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={loading}
                    />
                    <label 
                      htmlFor="avatar-upload"
                      className="mt-2 inline-flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Change profile picture
                    </label>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ""}
                      readOnly
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email address
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Your company"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
              <p className="mt-1 text-sm text-gray-500">Manage your password and account security</p>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Change your password to secure your account</p>
                </div>
                <button 
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Change Password
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
