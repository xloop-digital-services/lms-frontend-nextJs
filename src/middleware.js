import { NextResponse } from "next/server";
const restrictedPathsStudent = [
  "/batch",
  "/location",
  "/class-scheduling",
  "/user-management",
  "/students",
];

const restrictedPathsInstructor = [
  "/batch",
  "/location",
  "/class-scheduling",
  "/user-management",
];

const restrictedPaths = [
  "/programs",
  "/courses",
  "/assignment",
  "/attendance",
  "/calendar",
  "/exam",
  "/grading",
  "/quiz",
  "/project",
  "/students",
  "/batch",
  "/location",
  "/class-scheduling",
  "/user-management",
];
export function middleware(req) {
  const accessToken = req.cookies.get("access_token")?.value;
  const userGroup = req.cookies.get("userGroup")?.value;
  const userDataCookie = req.cookies.get("userData")?.value;
  const path = req.nextUrl.pathname;
  let userData;
  try {
    userData = userDataCookie ? JSON.parse(userDataCookie) : null;
  } catch (err) {
    // //console.error("Error parsing userData from cookies:", err);
    userData = null;
  }

  const isPublicRoute =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/signup") ||
    path.startsWith("/application") ||
    path.startsWith("/auth/reset-password") ||
    path.startsWith("/auth/account-verify");

  const isRestrictedForStudent = restrictedPathsStudent.some((route) =>
    path.startsWith(route)
  );
  const isRestrictedForInstructor = restrictedPathsInstructor.some((route) =>
    path.startsWith(route)
  );
  const isRestricted = restrictedPaths.some((route) => path.startsWith(route));

  if (!accessToken) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } else {
    if (userGroup === "admin") {
      return NextResponse.next();
    }
    if (
      accessToken &&
      path.startsWith("/auth/login")
      //   || path.startsWith("/auth/signup")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (userGroup === "student" || userGroup === "instructor") {
      if (userData?.session === false && isRestricted) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (userGroup === "student" && isRestrictedForStudent) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (userGroup === "instructor" && isRestrictedForInstructor) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    if (!userGroup) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/batch/:path*",
    "/location/:path*",
    "/class-scheduling/:path*",
    "/user-management/:path*",
    "/students/:path*",
    "/courses/:path*",
    "/programs/:path*",
    "/user/:path*",
    "/quiz/:path*",
    "/assignment/:path*",
    "/assignment/course/:path*",
    "/project/:path*",
    "/exam/:path*",
    "/grading/:path*",
    "/application",
    "/auth/login",
    "/auth/account-verify/:path*",
    "/auth/reset-password/:path*",
    "/auth/signup",
    "/",
  ],
};
