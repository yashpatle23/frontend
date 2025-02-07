import dbConnect from "../../../utils/dbConnect";
import Doctor from "../../../models/Doctor";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
}
