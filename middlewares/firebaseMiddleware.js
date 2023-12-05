// VerifyTokenMiddleware.js
import admin from "../firebase/config.js";
import asyncHandler from "express-async-handler";
const decodeToken = asyncHandler(async (req, res, next) => {
  const { userToken } = req.body;
  // Add this line before the verifyIdToken call

  try {
    const decodedToken = await admin.auth().verifyIdToken(userToken);

    if (decodedToken) {
      req.user = decodedToken;
      console.log(decodedToken);
      return next();
    }
    return res.json({ message: "Invalid Login Token" });
  } catch (error) {
    console.error(error.message);
    return res.json({ message: "Something Went Wrong. Try again" });
  }
});

export default decodeToken;
