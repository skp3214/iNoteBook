
export const handleAuthResponse = async (response, navigate) => {
    if (response.status === 401) {
        try {
            const errorData = await response.json();
            if (errorData.expired) {
                // Token expired - clear and redirect
                localStorage.removeItem('token');
                if (navigate) {
                    navigate('/login', { 
                        state: { message: 'Your session has expired. Please login again.' } 
                    });
                }
                return false;
            }
        } catch (e) {
            // If JSON parsing fails, still handle as auth error
            localStorage.removeItem('token');
            if (navigate) {
                navigate('/login', { 
                    state: { message: 'Authentication failed. Please login again.' } 
                });
            }
            return false;
        }
        
        localStorage.removeItem('token');
        if (navigate) {
            navigate('/login', { 
                state: { message: 'Please login to continue.' } 
            });
        }
        return false;
    }
    
    return response.ok;
};

