import config from "../config";
import { User } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (...requiredRole: string[]) =>
  catchAsync(async (req, res, next) => {
    const authorization = req.headers.authorization as string;
    // console.log(authorization?.split(" "));
    if (!authorization) {
      throw new Error("Authorization Required");
    }

    const [Bearer, token] = authorization.split(" ") as string[];
    if (Bearer !== "Bearer" || !token) {
      throw new Error("You are not Authorized!");
    }
    const decoded = jwt.verify(token, config.secret as string) as JwtPayload;
    const { email, role } = decoded;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (requiredRole && !requiredRole.includes(role)) {
      throw new Error("you are not Authorized");
    }
    req.user = decoded as JwtPayload;

    next();
  });

export default auth;
