// userUtils.js
export async function getCurrentUser() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return undefined
    }
  
    const response = await fetch('/current-user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user information');
    }
  
    return await response.json();
  }