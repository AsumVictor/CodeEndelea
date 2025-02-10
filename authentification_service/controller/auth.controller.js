import catchAsyncError from "../middleware/catchAsyncError.js";
import ResponseError from "../utilities/ErrorHandler.js";
import VideoModel from "../model/user.model.js";

// Register account route
export const register = catchAsyncError(async (req, res, next) => {
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// login account route
export const login = catchAsyncError(async (req, res, next) => {
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// logout account route
export const logout = catchAsyncError(async (req, res, next) => {
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// logout account route
export const verifyJWT = catchAsyncError(async (req, res, next) => {
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// logout account route
export const generate_access_token = catchAsyncError(async (req, res, next) => {
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// logout account route
export const generate_refresh_token = catchAsyncError(
  async (req, res, next) => {
    try {
      // Todo: I will add business logic later
    } catch (error) {
      return next(new ResponseError(error.message, 400));
    }
  }
);

// logout account route
export const activate_account = catchAsyncError(async (req, res, next) => {
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});
