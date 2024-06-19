import express from "express";
import { Melding } from "../models/meldingen.js";
import { submitMelding } from "../controllers/index.js";

const meldingRouter = express.Router();

// Read function - Retrieve all articles
meldingRouter.get("/meldingen", async (req, res) => {
  try {
    const meldingen = await Melding.find({});
    console.log("GET meldingen");
    return res.status(200).json({ count: meldingen.length, data: meldingen });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Detail function - Retrieve a specific article by ID
meldingRouter.get("/meldingen/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const melding = await Melding.findById(id);
    if (!melding) {
      return res.status(404).json({ message: "Artikel niet gevonden" });
    }
    return res.status(200).json(melding);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

meldingRouter.post("/meldingen", submitMelding);

// Update function - Modify an existing article
meldingRouter.put("/meldingen/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { liftID, escelatorID, defect } = req.body;
    if (!liftID && !escelatorID) {
      return res.status(400).json({ message: "Vul alle verplichte velden in" });
    }
    const updatedMelding = await Melding.findByIdAndUpdate(
      id,
      { liftID, escelatorID, defect },
      { new: true }
    );
    if (!updatedMelding) {
      return res.status(404).json({ message: "Artikel niet gevonden" });
    }
    return res
      .status(200)
      .json({ message: "Artikel aangepast", updatedMelding });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete function - Remove an article
meldingRouter.delete("/meldingen/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMelding = await Melding.findByIdAndDelete(id);
    if (!deletedMelding) {
      return res.status(404).json({ message: "Artikel niet gevonden" });
    }
    return res.status(200).json({ message: "Artikel verwijderd" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default meldingRouter;
