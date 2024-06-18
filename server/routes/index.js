import { Router } from "express";
import meldingenRouter from "../routes/meldingen.routes.js";  // Zorg ervoor dat je juiste routers importeert
import feedbackRoutes from "../routes/feedback.routes.js";  // Zorg ervoor dat je juiste routers importeert

const appRouter = Router();

appRouter.use((req, res, next) => {
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
appRouter.use("/meldingen", meldingenRouter);

// feedback routes
appRouter.use("/feedback", feedbackRoutes);

export default appRouter;
