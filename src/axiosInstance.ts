// import axios from "axios";

// // Set up Axios instance
// const api = axios.create({
//     baseURL: 'https://localhost:7123/api', // Backend API base URL
//   });
  
//   // Add an interceptor to include the token in all requests
//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem('token');
//       console.log(token);
      
//       if (token) {
//         // if (config.headers) { // לוודא ש-header קיים
//           config.headers['Authorization'] = `Bearer ${token}`;
//           // }
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
  
//   export default api;
