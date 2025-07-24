let API_BASE = "http://localhost:3030";
if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
  API_BASE = process.env.REACT_APP_API_URL;
} else if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
  API_BASE = import.meta.env.VITE_API_URL;
}
export default API_BASE; 