const prod = {
  url: {
    API_BASE_URL: "https://netquest-labdsof-prod.onrender.com/",
  },
};
const local = {
  url: {
    API_BASE_URL: "http://localhost:8080",
  },
};
const dev = {
  url: {
    API_BASE_URL: "https://netquest-dev-environment.onrender.com",
  },
};
export const config =
  process.env.NODE_ENV === "development"
    ? local
    : process.env.ENVIRONMENT === "prod"
      ? prod
      : dev;
