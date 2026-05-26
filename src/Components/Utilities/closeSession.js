import api from "../../Sources/Api";

export default function closeSession() {
  api.get("/auth/logout").then(() => window.location.href = "/login");
  
}