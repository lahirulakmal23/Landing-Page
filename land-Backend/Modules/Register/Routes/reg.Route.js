import { Router } from "express";
import { body, validationResult } from "express-validator";
import { register } from "../Controller/reg.Controller.js";

const router = Router();

// small helper to reuse your validator pattern
const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// Choose ONE style:

// A) REST style: POST /api/attendees
router.post(
  "/",
  validate([
    body("fullName").isString().trim().isLength({ min: 2, max: 120 }),
    body("email").isEmail().normalizeEmail(),
    body("nic").matches(/^(?:\d{12}|\d{9}[VvXx])$/),
    body("password").isString().isLength({ min: 6 }),
    body("phone").optional().isString().trim(),
  ]),
  register
);

// // B) If you prefer explicit: POST /api/attendees/register
// router.post(
//   "/register",
//   validate([
//     body("fullName").isString().trim().isLength({ min: 2, max: 120 }),
//     body("email").isEmail().normalizeEmail(),
//     body("nic").matches(/^(?:\d{12}|\d{9}[VvXx])$/),
//     body("password").isString().isLength({ min: 6 }),
//     body("phone").optional().isString().trim(),
//   ]),
//   register
// );

export default router;
