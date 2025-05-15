import React, { useState, useEffect } from 'react';
import { initFacebookSdk, loginWithFacebook, getFacebookPages } from '@/lib/facebookSdk';
import supabase from '@/lib/supabase';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface FacebookConnectorProps {
  userId: string;
  onPageSelected: (page: FacebookPage) => void;
}

const FacebookConnector: React.FC<FacebookConnectorProps> = ({ userId, onPageSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Initialize Facebook SDK when component mounts
    const loadSdk = async () => {
      try {
        await initFacebookSdk();
        setSdkLoaded(true);
      } catch (err) {
        console.error("Failed to load Facebook SDK", err);
        setError("Failed to load Facebook integration. Please try again later.");
      }
    };
    
    loadSdk();
  }, []);

  const connectFacebook = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Login with Facebook
      const authResponse = await loginWithFacebook();
      
      if (!authResponse) {
        setError("Facebook login failed or was cancelled");
        setIsLoading(false);
        return;
      }
      
      // Get user's Facebook pages
      const userPages = await getFacebookPages(authResponse.accessToken);
      
      if (userPages.length === 0) {
        setError("No Facebook pages found for your account. Make sure you have admin access to at least one page.");
        setIsLoading(false);
        return;
      }
      
      setPages(userPages);
      
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to Facebook");
    } finally {
      setIsLoading(false);
    }
  };

  const selectPage = async (page: FacebookPage) => {
    try {
      // Save page to Supabase if user ID is available
      if (userId) {
        const { error } = await supabase.from('facebook_pages').insert({
          user_id: userId,
          fb_page_id: page.id,
          fb_page_name: page.name,
          fb_page_access_token: page.access_token,
          created_at: new Date().toISOString()
        });
        
        if (error) {
          console.error("Error saving Facebook page:", error);
          setError("Failed to save Facebook page. Please try again.");
          return;
        }
      } else {
        console.log("Facebook page selected:", page);
      }
      
      // Notify parent component
      onPageSelected(page);
      
      // Clear pages list
      setPages([]);
      
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the page");
    }
  };

  return (
    <div className="my-4">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {pages.length === 0 ? (
        <button
          type="button"
          onClick={connectFacebook}
          disabled={isLoading || !sdkLoaded}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Connect Facebook Page
            </span>
          )}
        </button>
      ) : (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Select a Facebook page to connect:</p>
          <div className="space-y-2">
            {pages.map(page => (
              <button
                key={page.id}
                type="button"
                onClick={() => selectPage(page)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <span>{page.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookConnector;
