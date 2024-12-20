const express = require("express");
const {
  registerUser,
  resetUserPassword,
  userPasswordForgot,
  userLogin,
  updateUserPreferences,
} = require("../controllers/userController");
const {
  getAllOnlineUser,
  getAllUsersFromAdmin,
  updatedUserFromAdmin,
  deleteUserfromAdmin,
} = require("../controllers/adminController");
const { validateRegister } = require("../utils/validateRegister");
const router = express.Router();

router.post("/login", userLogin);
router.post("/register", validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
});
router.post("/forgot-password", userPasswordForgot);
router.post("/reset-password", resetUserPassword);
router.post("/update-preferences", updateUserPreferences);
router.post("/admin/users", getAllUsersFromAdmin);
router.post("/admin/users/:id", updatedUserFromAdmin);
router.post("/admin/users/:id", deleteUserfromAdmin);
router.post("/admin/users/:id", updateUserPreferences);
router.post("/admin/users/online", getAllOnlineUser);
router.post("/admin/users/:id", updateUserPreferences);
router.post("/admin/users/:id", updateUserPreferences);

module.exports = router;
