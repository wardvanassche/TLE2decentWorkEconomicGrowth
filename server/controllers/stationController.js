import { Melding } from "../models/meldingen.js";

const stationMapping = (id) => {
  if (id >= 1 && id <= 20) return "beurs";
  if (id >= 21 && id <= 40) return "wilhelminaplein";
  if (id >= 41 && id <= 60) return "kralingse zoom";
  return null;
};

const getStationElevatorStatuses = async (station1, station2) => {
  try {
    const allMeldingen = await Melding.find({
      escalatorId: { $gte: 1, $lte: 60 },
    }).sort({ createdAt: -1 });

    const escalatorStatuses = {};

    allMeldingen.forEach((melding) => {
      const station = stationMapping(melding.escalatorId);
      if (station === station1 || station === station2) {
        if (!escalatorStatuses[melding.escalatorId]) {
          escalatorStatuses[melding.escalatorId] = [];
        }
        if (escalatorStatuses[melding.escalatorId].length < 5) {
          escalatorStatuses[melding.escalatorId].push(melding.status);
        }
      }
    });

    const brokenEscalators = [];
    Object.keys(escalatorStatuses).forEach((escalatorId) => {
      const statuses = escalatorStatuses[escalatorId];
      const averageStatus =
        statuses.reduce((sum, status) => sum + (status ? 1 : 0), 0) /
        statuses.length;
      if (averageStatus > 0.5) {
        brokenEscalators.push({
          escalatorId: Number(escalatorId),
          station: stationMapping(Number(escalatorId)),
        });
      }
    });

    const overallStatus =
      brokenEscalators.length / Object.keys(escalatorStatuses).length > 0.5
        ? "kapot"
        : "functioning";

    return {
      status: overallStatus,
      brokenEscalators,
    };
  } catch (error) {
    console.error("Error fetching elevator statuses:", error);
    throw new Error("Database fetch error");
  }
};

const stationController = async (req, res) => {
  try {
    const { station1, station2 } = req.body;

    if (!station1 || !station2) {
      return res
        .status(400)
        .json({ message: "Both station names are required" });
    }

    const result = await getStationElevatorStatuses(
      station1.toLowerCase(),
      station2.toLowerCase()
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error checking elevator statuses:", error);
    res.status(500).send({ message: error.message });
  }
};

export default stationController;
