const authRouter = require("express").Router();

const {
    registerUser,
    loginUser,
    profile,

} = require("../controllers/authControllers");

const {
    validateMiddleware,
    validateLoginMiddleware,
    protectMiddleware
} = require("../middlewares/authMiddleware");

const {
    validate
} = require("../middlewares/leadMiddleware");

const {
    createUserSchema,
    loginUserSchema
} = require("../validators/authValidator")

authRouter.post("/register",  validateMiddleware, validate(createUserSchema) ,registerUser);
authRouter.post("/login", validateLoginMiddleware, validate(loginUserSchema), loginUser);
authRouter.get("/me", protectMiddleware, profile);




module.exports = authRouter;