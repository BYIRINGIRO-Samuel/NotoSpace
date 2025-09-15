import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/error.class.js";
import { config } from "../config/default.js";
import User, { IUser } from "../models/users.model.js";
import BlackListedToken from "../models/blackListedToken.model.js";

interface IRequest extends Request {
  user?: Pick<
    IUser,
    "_id" | "name" | "email" | "profilePicture" | "role" | "school"
  > | null;
}

const decodeJWTMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.jwt;
  if (!token) return next();

  try {
    const blackListedToken = await BlackListedToken.findOne({ token });
    if (blackListedToken) {
      // Clear the invalid token from cookies
      res.clearCookie("jwt");
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    const userData = await User.findOne({ publicId: decoded.pid });
    if (!userData) {
      // Clear the invalid token from cookies
      res.clearCookie("jwt");
      return next();
    }

    if (decoded && typeof decoded === "object" && decoded.pid) {
      req.user = {
        _id: userData._id as string,
        name: userData.name as string,
        email: userData.email as string,
        profilePicture: userData.profilePicture as string,
        role: userData.role as string,
        school: userData.school as string,
      };
    }
    return next();
  } catch (error) {
    console.log(`Error in decodeJWTMiddleware:`, error);
    // Clear the invalid token from cookies and continue without throwing error
    res.clearCookie("jwt");
    return next();
  }
};

const protectedRoute = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?._id)
      throw new HttpError(
        401,
        "You are not logged in. Please log in to continue.",
      );

    const user = await User.findById(req.user._id);
    if (!user) throw new HttpError(401, "Unauthorized");

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(
        new HttpError(401, "Your session has expired. Please log in again."),
      );
    } else if (error.name === "JsonWebTokenError") {
      return next(
        new HttpError(
          401,
          "There was a problem with your session. Please log in again.",
        ),
      );
    }
    next(error);
  }
};

// reusable role-checking middleware factory
const protectedRouteByRole = (allowedRoles: string[]) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?._id) throw new HttpError(401, "Unauthorized");

      const user = await User.findById(req.user._id).populate("role");
      if (!user) throw new HttpError(401, "Unauthorized");

      const userRole = (user.role as any).type;
      if (!allowedRoles.includes(userRole)) {
        throw new HttpError(
          401,
          `Unauthorized - Allowed roles: ${allowedRoles.join(", ")}`,
        );
      }

      next();
    } catch (error) {
      console.log(
        `Error in protected route for roles [${allowedRoles.join(", ")}]:`,
        error,
      );
      next(error);
    }
  };
};

const unProtectedRoutes = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const isAuthRoute =
      req.originalUrl.includes("/users/login") ||
      req.originalUrl.includes("/users/create") ||
      req.originalUrl.includes("/users/forgot-password") ||
      req.originalUrl.includes("/users/reset-password");

    if (isAuthRoute) {
      if (req.user?._id) {
        next(
          new HttpError(
            401,
            "You are already logged in. Please logout to continue.",
          ),
        );
      }
    }

    next();
  } catch (error) {
    console.error("Error in unProtectedRoutes middleware:", error);
    next(error);
  }
};

const protectedAdminRoute = protectedRouteByRole(["admin"]);
const protectedTeacherRoute = protectedRouteByRole(["teacher"]);
const protectedStudentRoute = protectedRouteByRole(["student"]);
const protectedTeacherAdminRoute = protectedRouteByRole(["teacher", "admin"]);

export {
  IRequest,
  decodeJWTMiddleware,
  unProtectedRoutes,
  protectedRoute,
  protectedAdminRoute,
  protectedTeacherRoute,
  protectedStudentRoute,
  protectedTeacherAdminRoute,
};
