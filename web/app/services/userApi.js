import ApiService from "./api";

export async function getUserId() {
  let userId = getCookie("userId");
  if (!userId) {
    userId = (await createUserId());
    setCookie("userId", userId);
  }

  return userId;
}

export function getUserData(userId) {
  return ApiService.request(`/users/get?id=${userId}`);
}

// Helper Functions
async function createUserId() {
  // request and return a new user ID
  const response = await ApiService.request("/users/create", {
    method: "POST"
  });

  if (response.status !== 200) {
    throw new Error("Failed to create user ID");
  }

  return response.id;
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

