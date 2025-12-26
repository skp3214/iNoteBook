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

        // Regular session expired
        localStorage.removeItem('token');
        if (navigate) {
            navigate('/login', {
                state: { message: 'Your session has expired. Please login again.' }
            });
        }
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