import catchAsyncError from "../middleware/catchAsyncError.js";
import ResponseError from "../utilities/ErrorHandler.js";
import UserModel from "../model/user.model.js";

// Register account route
/**
 * @access_token
 * @refresh_token
 */
export const register = catchAsyncError(async (req, res, next) => {
  try {
    /**
     * Controller for registring a user
     * For every user, we require
     * - @username (required and unique)
     * - @email (required and should follow partnered email format eg. victor.asum@ashesi.edu.gh only ashesi.edu.gh required for now. If email does not follow such format throw error.)
     * - @password (required, a password should be hashed before saving in the database)
     * - @acess (user role)
     * - ...
     */

    if (!username || !email || !password || !access) {
      return next(ResponseError("All filed are required!", 400));
    }

    // check for duplicate users
    const exist_user = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (exist_user) {
      return next(
        ResponseError(
          "This email or username has already been registered! Login",
          400
        )
      );
    }


    // create a new user
    // return new access and refresh token to the 

  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// login account route
export const login = catchAsyncError(async (req, res, next) => {
  /**
   * @email
   * raw @passowrd
   */

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
  /**
   * Take @refresh_token and validate (validity, expiring date)
   * return status response @boolean
   */
  try {
    // Todo: I will add business logic later
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

// logout account route
export const generate_access_token = catchAsyncError(async (req, res, next) => {
  /**
   * We will take user details and generate access token
   */
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
