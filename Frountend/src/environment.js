const is_Prod = false;
const server = is_Prod
  ? "http://localhost:8080"
  : "https://grow-aibackend.onrender.com";

export default server;
