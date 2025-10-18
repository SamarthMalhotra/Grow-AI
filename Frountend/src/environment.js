const is_Prod = true;
const server = is_Prod
  ? "http://localhose:8080"
  : "https://grow-aibackend.onrender.com";

export default server;
