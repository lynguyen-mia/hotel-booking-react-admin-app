export function getToken() {
  // get token from local storage
  const tokenJSON = localStorage.getItem("adminToken");
  const token = JSON.parse(tokenJSON);
  return token;
}

export function authorizeToken() {
  const token = getToken();
  if (!token) {
    return window.location.assign("/auth");
  }
  return null;
}
