export const setCookie = (name: string, value: string) => {
  // set or update a cookie
  document.cookie = `${name}=${value}; path=/; max-age=31536000`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};
