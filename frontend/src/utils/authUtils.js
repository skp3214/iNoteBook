const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const clearAuthData = (navigate, message = 'Your session has expired. Please login again.') => {
    localStorage.removeItem('token');
    if (navigate) {
        navigate('/login', {
            state: { message }
        });
    }
};

export const refreshAccessToken = async () => {
    const response = await fetch(`${apiBaseUrl}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    if (data?.authtoken) {
        localStorage.setItem('token', data.authtoken);
        return data.authtoken;
    }

    return null;
};

export const authenticatedFetch = async (url, options = {}, navigate) => {
    const headers = {
        ...(options.headers || {}),
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers.authtoken = token;
    }

    let response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (response.status !== 401) {
        return response;
    }

    const newToken = await refreshAccessToken();
    if (!newToken) {
        clearAuthData(navigate);
        return response;
    }

    response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            authtoken: newToken
        },
        credentials: 'include'
    });

    if (response.status === 401) {
        clearAuthData(navigate);
    }

    return response;
};

export const handleAuthResponse = async (response, navigate) => {
    let data = {};

    try {
        data = await response.json();
    } catch (e) {
        data = { error: 'Invalid response from server' };
    }

    if (response.status === 401) {
        if (data.requiresApiKey || 
            (data.error && data.error.includes('API key invalid or expired'))) {
            return {
                isValid: false,
                isApiKeyError: true,
                message: data.error || 'Your Gemini API key is invalid or expired. Please add a valid one.',
                data 
            };
        }

        clearAuthData(navigate);
        return {
            isValid: false,
            isApiKeyError: false,
            message: 'Session expired. Redirecting to login...'
        };
    }

    return {
        isValid: response.ok,
        isApiKeyError: false,
        message: data.error || null,
        data 
    };
};