// Facebook SDK integration for Kritiqo

// Initialize the Facebook SDK
export const initFacebookSdk = () => {
  return new Promise<void>((resolve) => {
    // Load the Facebook SDK script if it's not already loaded
    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      
      script.onload = () => {
        (window as any).FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v17.0'
        });
        resolve();
      };
      
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
};

// Login with Facebook and request permissions
export const loginWithFacebook = (): Promise<{
  accessToken: string;
  userId: string;
} | null> => {
  return new Promise((resolve) => {
    const FB = (window as any).FB;
    if (!FB) {
      console.error("Facebook SDK not loaded");
      resolve(null);
      return;
    }
    
    FB.login((response: any) => {
      if (response.authResponse) {
        resolve({
          accessToken: response.authResponse.accessToken,
          userId: response.authResponse.userID
        });
      } else {
        console.log('User cancelled login or did not fully authorize');
        resolve(null);
      }
    }, { scope: 'pages_show_list,pages_read_engagement,pages_read_user_content' });
  });
};

// Get user's Facebook pages
export const getFacebookPages = async (accessToken: string): Promise<Array<{
  id: string;
  name: string;
  access_token: string;
}>> => {
  return new Promise((resolve, reject) => {
    const FB = (window as any).FB;
    if (!FB) {
      reject(new Error("Facebook SDK not loaded"));
      return;
    }

    FB.api('/me/accounts', { access_token: accessToken }, (response: any) => {
      if (response.error) {
        console.error('Error fetching Facebook pages:', response.error);
        reject(new Error(response.error.message));
        return;
      }
      
      resolve(response.data || []);
    });
  });
};
