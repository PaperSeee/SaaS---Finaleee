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
        console.error("Failed to initialize Facebook SDK:", err);
        setError("Failed to load Facebook integration. Please try again later.");
      }
    };
    
    loadSdk();
  }, []);

  const connectFacebook = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!sdkLoaded) {
        // Make sure SDK is initialized first
        await initFacebookSdk();
        setSdkLoaded(true);
      }
      
      const loginResponse = await loginWithFacebook();
      
      if (!loginResponse.authResponse) {
        throw new Error("Facebook login failed");
      }
      
      const pagesData = await getFacebookPages();
      
      if (pagesData.length === 0) {
        throw new Error("No Facebook pages found. Make sure you have admin access to a Facebook page.");
      }
      
      setPages(pagesData);
    } catch (err: any) {
      console.error("Facebook connection error:", err);
      setError(err.message || "Failed to connect to Facebook");
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
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {pages.length === 0 ? (
        <button
          type="button"
          onClick={connectFacebook}
          disabled={isLoading || !sdkLoaded}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading || !sdkLoaded ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : !sdkLoaded ? (
            'Loading Facebook SDK...'
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Connect with Facebook
            </>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-indigo-700">Select a Facebook Page:</h4>
          <div className="bg-indigo-50 border border-indigo-100 rounded p-2 max-h-40 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => selectPage(page)}
                className="w-full text-left px-3 py-2 hover:bg-indigo-100 rounded flex items-center justify-between text-sm transition-colors"
              >
                <span className="font-medium text-indigo-800">{page.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {!sdkLoaded && (
        <p className="text-xs text-indigo-600">
          Loading Facebook integration...
        </p>
      )}
    </div>
  );
};

export default FacebookConnector;
