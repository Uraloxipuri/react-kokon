export async function exchangeAuthCodeForTokens(authCode) {
  const clientId = 'your-client-id'; // Replace with your actual Cognito App Client ID
  const redirectUri = 'your-redirect-uri/user-interface'; // Replace with your actual redirect URI
  const cognitoDomain = 'https://your-cognito-domain'; // Replace with your actual Cognito domain

  const tokenUrl = `${cognitoDomain}/oauth2/token`;

  const bodyData = new URLSearchParams();
  bodyData.append('grant_type', 'authorization_code');
  bodyData.append('client_id', clientId);
  bodyData.append('code', authCode);
  bodyData.append('redirect_uri', redirectUri);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyData,
    });

    if (response.ok) {
      const tokens = await response.json();
      console.log('Tokens:', tokens);

      localStorage.setItem('id_token', tokens.id_token);
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);

      // Remove the authorization code from the URL
      window.history.replaceState({}, document.title, redirectUri);

      // Now the user is authenticated, you can proceed
      alert('Logged in successfully!');
    } else {
      console.error(
        'Failed to exchange authorization code for tokens:',
        response.statusText
      );
      alert('Error during login, please try again.');
    }
  } catch (error) {
    console.error('Error during token exchange:', error);
  }
}

export function checkAuthentication() {
  const idToken = localStorage.getItem('id_token');

  if (!idToken) {
    // Redirect to Cognito login
    window.location.href =
      'https://your-cognito-domain/login?client_id=your-client-id&response_type=code&scope=email+openid+profile&redirect_uri=your-redirect-uri/user-interface';
  } else {
    console.log('User is authenticated');
  }
}
