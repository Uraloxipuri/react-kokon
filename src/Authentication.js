// src/Authentication.js
export async function exchangeAuthCodeForTokens(authCode) {
  const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_COGNITO_REDIRECT_URI;
  const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;

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

      return true; // Indicate success
    } else {
      console.error('Failed to exchange authorization code for tokens:', response.statusText);
      return false; // Indicate failure
    }
  } catch (error) {
    console.error('Error during token exchange:', error);
    return false; // Indicate failure
  }
}
