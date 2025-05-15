// Facebook SDK integration for Kritiqo

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

/**
 * Initialize the Facebook SDK
 * This must be called before any other Facebook SDK functions
 */
export const initFacebookSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If the SDK is already loaded, resolve immediately
    if (window.FB) {
      console.log('Facebook SDK already loaded');
      resolve();
      return;
    }

    // Load the SDK asynchronously
    // Inject the Facebook SDK script
    const loadSdkAsynchronously = () => {
      // Don't load if already present
      if (document.getElementById('facebook-jssdk')) {
        return;
      }
      
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      if (!appId) {
        console.error('Facebook App ID is not defined in environment variables');
        reject(new Error('Facebook App ID is missing'));
        return;
      }

      // Setup async init function
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v19.0' // Use the latest stable version
        });
        
        console.log('Facebook SDK initialized successfully');
        resolve();
      };

      // Load the SDK
      console.log('Loading Facebook SDK...');
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      
      // Insert script before the first script on the page
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        // Fallback to appending to body
        document.body.appendChild(script);
      }
    };

    loadSdkAsynchronously();
  });
};

/**
 * Login with Facebook and request permissions
 * @returns Promise with login response
 */
export const loginWithFacebook = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Ensure FB SDK is initialized
    if (!window.FB) {
      reject(new Error('Facebook SDK not initialized. Call initFacebookSdk() first.'));
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log('Facebook login successful', response);
          resolve(response);
        } else {
          console.log('Facebook login cancelled or failed');
          reject(new Error('Login cancelled or failed'));
        }
      },
      {
        scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_metadata,pages_read_user_content',
        return_scopes: true
      }
    );
  });
};

/**
 * Get pages the user manages
 * @returns Promise with array of Facebook pages
 */
export const getFacebookPages = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // Ensure FB SDK is initialized
    if (!window.FB) {
      reject(new Error('Facebook SDK not initialized. Call initFacebookSdk() first.'));
      return;
    }

    window.FB.api('/me/accounts', (response: any) => {
      if (response && !response.error) {
        console.log('Facebook pages retrieved', response);
        resolve(response.data || []);
      } else {
        console.error('Error getting Facebook pages:', response?.error);
        reject(new Error(response?.error?.message || 'Failed to get Facebook pages'));
      }
    });
  });
};
