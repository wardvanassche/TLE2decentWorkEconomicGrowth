import { Router } from "express";
import router from "./index.js";

const router = Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  if (req.headers?.accept === "application/json") {
    next();
  } else {
    console.log(req.headers);
    res
      .status(400)
      .json({ ERROR: "Incorrect header please send application/json" });
  }
});

// meldingen routes
router.use("/meldingen", meldingenRouter);

// feedback routes
router.use("/feedback", feedbackRoutes);

export default router;
