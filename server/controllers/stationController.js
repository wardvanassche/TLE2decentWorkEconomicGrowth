import { Melding } from "../models/meldingen.js";

const stationMapping = (id) => {
  if (id >= 1 && id <= 20) return "beurs";
  if (id >= 21 && id <= 40) return "wilhelminaplein";
  if (id >= 41 && id <= 60) return "kralingse zoom";
  return null;
};

const getStationElevatorStatuses = async (station1, station2) => {
  try {
    console.log("Fetching all meldingen...");
    const allMeldingen = await Melding.find({
      escalatorId: { $gte: 1, $lte: 60 },
    }).sort({ createdAt: -1 });

    console.log("Fetched all meldingen:", allMeldingen.length);

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

    console.log("Escalator statuses:", escalatorStatuses);

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

    console.log("Broken escalators:", brokenEscalators);

    const overallStatus =
      brokenEscalators.length / Object.keys(escalatorStatuses).length > 0.5
        ? "kapot"
        : "functioning";

    console.log("Overall status:", overallStatus);

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

    console.log("Received request with stations:", station1, station2);

    if (!station1 || !station2) {
      console.log("Both station names are required");
      return res
        .status(400)
        .json({ message: "Both station names are required" });
    }

    const lowerStation1 = station1.toLowerCase();
    const lowerStation2 = station2.toLowerCase();

    console.log("Lowercased stations:", lowerStation1, lowerStation2);

    const result = await getStationElevatorStatuses(lowerStation1, lowerStation2);

    console.log("Result from getStationElevatorStatuses:", result);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error checking elevator statuses:", error);
    res.status(500).send({ message: error.message });
  }
};

export default stationController;
