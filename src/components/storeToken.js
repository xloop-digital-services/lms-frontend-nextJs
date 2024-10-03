import Cookies from "js-cookie";

export async function storeToken(request, user) {
  Cookies.set("access_token", request.access);
  Cookies.set("refresh_token", request.refresh);
}