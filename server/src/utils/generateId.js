// Pattern: TYPE-XXXX (e.g., PAT-0001, APT-0002, RX-0003)
const prefixes = {
  patient: "PAT",
  appointment: "APT",
  prescription: "RX",
  bill: "BILL",
  doctor: "DOC",
};

let counters = {
  patient: 0,
  appointment: 0,
  prescription: 0,
  bill: 0,
  doctor: 0,
};

// In production, these should be fetched from DB
export const generateId = (type) => {
  if (!prefixes[type]) {
    throw new Error(`Invalid ID type: ${type}`);
  }

  counters[type]++;
  const counter = String(counters[type]).padStart(4, "0");
  return `${prefixes[type]}-${counter}`;
};

// For DB queries, this would fetch the last ID and increment
export const initializeCounter = async (type, Model) => {
  try {
    const lastRecord = await Model.findOne().sort({ createdAt: -1 });
    if (lastRecord && lastRecord[`${type}Id`]) {
      const lastNumber = parseInt(lastRecord[`${type}Id`].split("-")[1], 10);
      counters[type] = lastNumber;
    }
  } catch (error) {
    console.log(`Could not initialize counter for ${type}`);
  }
};
