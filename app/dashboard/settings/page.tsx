"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();
  const _supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings state
  const [generalSuccess, setGeneralSuccess] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [generalLoading, setGeneralLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timeZone, setTimeZone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  
  // Notification settings state
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [notificationError, setNotificationError] = useState("");
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Privacy settings state
  const [privacySuccess, setPrivacySuccess] = useState("");
  const [privacyError, setPrivacyError] = useState("");
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);
  
  // Integrations settings state
  const [integrationsSuccess, setIntegrationsSuccess] = useState("");
  const [integrationsError, setIntegrationsError] = useState("");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [yelpConnected, setYelpConnected] = useState(false);
  
  // Handle general settings form submission
  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralLoading(true);
    setGeneralSuccess("");
    setGeneralError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real application, you would update the settings in your database
      // const { error } = await _supabase
      //   .from('user_settings')
      //   .upsert({
      //     user_id: user?.id,
      //     language,
      //     time_zone: timeZone,
      //     date_format: dateFormat
      //   });
      
      // if (error) throw error;
      
      setGeneralSuccess("Settings updated successfully");
    } catch (err: unknown) {
      const typedError = err as Error;
      setGeneralError(typedError.message || "Failed to update settings");
    } finally {
      setGeneralLoading(false);
    }
  };

  // Handle notification settings form submission
  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationLoading(true);
    setNotificationSuccess("");
    setNotificationError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNotificationSuccess("Notification preferences updated successfully");
    } catch (err: unknown) {
      const typedError = err as Error;
      setNotificationError(typedError.message || "Failed to update notification settings");
    } finally {
      setNotificationLoading(false);
    }
  };

  // Handle privacy settings form submission
  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrivacyLoading(true);
    setPrivacySuccess("");
    setPrivacyError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPrivacySuccess("Privacy settings updated successfully");
    } catch (err: unknown) {
      const typedError = err as Error;
      setPrivacyError(typedError.message || "Failed to update privacy settings");
    } finally {
      setPrivacyLoading(false);
    }
  };
  
  // Handle connect/disconnect integrations
  const handleToggleIntegration = async (integration: string, connect: boolean) => {
    setIntegrationsSuccess("");
    setIntegrationsError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (integration === 'google') {
        setGoogleConnected(connect);
      } else if (integration === 'facebook') {
        setFacebookConnected(connect);
      } else if (integration === 'yelp') {
        setYelpConnected(connect);
      }
      
      setIntegrationsSuccess(`Successfully ${connect ? 'connected to' : 'disconnected from'} ${integration}`);
    } catch (err: unknown) {
      const typedError = err as Error;
      setIntegrationsError(typedError.message || `Failed to ${connect ? 'connect to' : 'disconnect from'} ${integration}`);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gradient-to-tr from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Settings
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Tabs navigation */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['general', 'notifications', 'privacy', 'integrations', 'subscription'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your basic account settings</p>
              </div>
              
              {generalSuccess && (
                <div className="mx-8 mt-6 rounded-lg bg-green-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-sm text-green-700">{generalSuccess}</p>
                </div>
              )}
              
              {generalError && (
                <div className="mx-8 mt-6 rounded-lg bg-red-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{generalError}</p>
                </div>
              )}
              
              <form onSubmit={handleGeneralSubmit} className="p-8 space-y-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="nl">Dutch</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                    Time Zone
                  </label>
                  <select
                    id="timeZone"
                    name="timeZone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={generalLoading}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {generalLoading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>Save Settings</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage how and when you receive notifications</p>
              </div>
              
              {notificationSuccess && (
                <div className="mx-8 mt-6 rounded-lg bg-green-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-sm text-green-700">{notificationSuccess}</p>
                </div>
              )}
              
              {notificationError && (
                <div className="mx-8 mt-6 rounded-lg bg-red-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{notificationError}</p>
                </div>
              )}
              
              <form onSubmit={handleNotificationsSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={emailNotifications} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailNotifications(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                  
                  <div className="ml-6 border-l-2 border-gray-100 pl-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-700">New Review Alerts</h3>
                        <p className="text-sm text-gray-500">Get notified when you receive a new review</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input 
                          type="checkbox" 
                          checked={reviewAlerts} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewAlerts(e.target.checked)}
                          className="peer sr-only" 
                          disabled={!emailNotifications}
                        />
                        <div className={`h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${emailNotifications ? 'bg-gray-200 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white' : 'bg-gray-100 cursor-not-allowed'}`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-700">Weekly Reports</h3>
                        <p className="text-sm text-gray-500">Receive a weekly summary of your business reviews</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input 
                          type="checkbox" 
                          checked={weeklyReports} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeeklyReports(e.target.checked)}
                          className="peer sr-only" 
                          disabled={!emailNotifications}
                        />
                        <div className={`h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${emailNotifications ? 'bg-gray-200 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white' : 'bg-gray-100 cursor-not-allowed'}`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-700">Marketing Updates</h3>
                        <p className="text-sm text-gray-500">Receive marketing emails and promotional offers</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input 
                          type="checkbox" 
                          checked={marketingEmails} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarketingEmails(e.target.checked)}
                          className="peer sr-only" 
                          disabled={!emailNotifications}
                        />
                        <div className={`h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${emailNotifications ? 'bg-gray-200 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white' : 'bg-gray-100 cursor-not-allowed'}`}></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={notificationLoading}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {notificationLoading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>Save Preferences</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Privacy Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your data privacy preferences</p>
              </div>
              
              {privacySuccess && (
                <div className="mx-8 mt-6 rounded-lg bg-green-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-sm text-green-700">{privacySuccess}</p>
                </div>
              )}
              
              {privacyError && (
                <div className="mx-8 mt-6 rounded-lg bg-red-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{privacyError}</p>
                </div>
              )}
              
              <form onSubmit={handlePrivacySubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Data Sharing</h3>
                      <p className="text-sm text-gray-500">Allow anonymous usage data to be shared for product improvement</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={dataSharing} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataSharing(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Activity Tracking</h3>
                      <p className="text-sm text-gray-500">Allow application to track your activity for personalization</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={activityTracking} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivityTracking(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
                  <div className="mt-4 space-y-4">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Download Your Data
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Request Account Deletion
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={privacyLoading}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {privacyLoading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>Save Privacy Settings</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Integrations</h2>
                <p className="mt-1 text-sm text-gray-500">Connect your account with external services</p>
              </div>
              
              {integrationsSuccess && (
                <div className="mx-8 mt-6 rounded-lg bg-green-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-sm text-green-700">{integrationsSuccess}</p>
                </div>
              )}
              
              {integrationsError && (
                <div className="mx-8 mt-6 rounded-lg bg-red-50 p-4 flex items-start">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{integrationsError}</p>
                </div>
              )}
              
              <div className="p-8 space-y-6">
                <div className="border rounded-lg border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-gray-100">
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21.35 11.1h-9.17v2.73h6.5c-.33 2.5-2.5 4.19-6.5 4.19-3.76 0-6.5-2.79-6.5-6.67 0-3.88 2.74-6.67 6.5-6.67 2.47 0 3.88.9 4.77 1.76L19.35 4c-1.48-1.4-3.47-2.26-6.68-2.26C6.83 1.74 2 6.56 2 12.33c0 5.77 4.83 10.59 10.67 10.59 5.91 0 10.04-4.19 10.04-10.16 0-.68-.07-1.35-.17-1.67h-10.5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Google</h3>
                        <p className="text-sm text-gray-500">Connect to import Google My Business reviews</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleIntegration('google', !googleConnected)}
                      className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        googleConnected
                          ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                          : 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      }`}
                    >
                      {googleConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                  {googleConnected && (
                    <div className="px-6 py-3 bg-white">
                      <p className="text-sm text-gray-600">Connected as {user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Last synced: Today at 10:30 AM</p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-gray-100">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Facebook</h3>
                        <p className="text-sm text-gray-500">Connect to import Facebook Page reviews</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleIntegration('facebook', !facebookConnected)}
                      className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        facebookConnected
                          ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                          : 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      }`}
                    >
                      {facebookConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                  {facebookConnected && (
                    <div className="px-6 py-3 bg-white">
                      <p className="text-sm text-gray-600">Connected as {user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Last synced: Yesterday at 3:45 PM</p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-gray-100">
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.77 10.32l0.01 0a1.05 1.05 0 01-.24 1.1c-.64.57-1.36.96-2.11 1.15-1.35.34-2.71.08-3.83-.74l-.08-.06c-.52-.39-.3-1.2.33-1.33.09-.02.18-.03.27-.03.74 0 1.26.61 2.2.61.17 0 .39-.02.61-.07.25-.06.48-.17.7-.33.05-.04.09-.08.13-.13.2-.3.14-.66-.19-.83l-.07-.03c-.94-.35-2.19-.5-3.6-.5-1.41 0-2.67.15-3.6.5l-.07.03c-.32.17-.39.52-.19.83.04.05.08.09.13.13.22.16.45.27.7.33.22.05.45.07.61.07.94 0 1.45-.61 2.2-.61.09 0 .18.01.27.03.62.13.84.94.33 1.33l-.08.06c-1.12.82-2.48 1.08-3.83.74-.75-.19-1.47-.58-2.11-1.15-.16-.14-.25-.34-.24-.56v-.05c-.1-1.41-.16-3.08.13-4.04.32-1.06.83-1.51 1.54-1.91.7-.4 2.48-1.47 6.29-1.47 3.81 0 5.59 1.07 6.29 1.47.71.4 1.22.85 1.54 1.91.29.96.23 2.63.13 4.04z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Yelp</h3>
                        <p className="text-sm text-gray-500">Connect to import Yelp business reviews</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleIntegration('yelp', !yelpConnected)}
                      className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        yelpConnected
                          ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                          : 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      }`}
                    >
                      {yelpConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                  {yelpConnected && (
                    <div className="px-6 py-3 bg-white">
                      <p className="text-sm text-gray-600">Connected as {user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Last synced: 3 days ago</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Subscription & Billing */}
          {activeTab === 'subscription' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Subscription & Billing</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your subscription and payment details</p>
              </div>
              
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                      <div className="mt-2 flex items-center">
                        <span className="text-sm font-medium text-gray-500">Free Plan</span>
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                    <Link 
                      href="/pricing" 
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      prefetch={false}
                    >
                      Upgrade Plan
                    </Link>
                  </div>
                  
                  <div className="mt-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-blue-800">
                            <Link href="/features" className="hover:underline">
                              Upgrade to Pro for advanced features
                            </Link>
                          </h4>
                          <p className="mt-1 text-xs text-blue-700">
                            Get access to unlimited businesses, bulk review management, custom reporting, and more.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Plan Features</h3>
                  
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">Up to 3 businesses</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">Basic analytics</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">Standard support</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span className="ml-3 text-sm text-gray-400">Unlimited review management</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span className="ml-3 text-sm text-gray-400">Advanced reporting</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                  <p className="mt-1 text-sm text-gray-500">No payment method added</p>
                  
                  <button className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Add Payment Method
                  </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
                  
                  <div className="mt-4 overflow-hidden border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 bg-gray-50 text-center text-sm text-gray-500">
                      No billing history available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
