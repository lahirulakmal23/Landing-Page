import Attendee from "../Model/reg.Model.js";

// INSERT ONLY
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, nic, password } = req.body;
    if (!fullName || !email || !nic || !password) {
      return res.status(400).json({ message: "fullName, email, nic and password are required" });
    }

    const att = new Attendee({ fullName, email, phone, nic });
    await att.setPassword(password);
    await att.save();

    return res.status(201).json({ message: "Attendee registered successfully", attendee: att });
  } catch (err) {
    // nice error for unique index collisions
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${field}. Already exists.` });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
