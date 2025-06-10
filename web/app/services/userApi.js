import ApiService from "./api";

// On first visit to a site, generate a unique user ID and add ent
export async function initUid() {
  if (!getCookie("uid")) {
    const uid = await generateUid();
    setCookie("uid", uid.id);
  }
}

// Generate unique user id
async function generateUid() {
  return ApiService.request('/user/generateUid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
}

// Retrieve a cookie with the given name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Update a cookie with the given name
function setCookie(name, value, days = 365, path = "/") {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=${path}`;
  document.cookie = cookieStr;
}
