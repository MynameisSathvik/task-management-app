export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => localStorage.setItem('token', t)
export const removeToken = () => localStorage.removeItem('token')

export const getUserFromToken = () => {
  const t = getToken();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split('.')[1]));
    return { id: payload.id, name: payload.name || payload.email || 'User', role: payload.role };
  } catch (e) { return null }
}
