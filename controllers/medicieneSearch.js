import axios from 'axios';
import { Medication } from '../models/medicine.js'; // Your Mongoose model

// Get the API key from environment variables
const OPENFDA_API_KEY = process.env.OPENFDA_API_KEY;

// 🟡 Main search: query from DB, fallback to OpenFDA
export const getMeds = async (req, res) => {
  const query = req.query.query?.toLowerCase();
  const source = req.query.source?.toLowerCase() || 'any';
  const limit = parseInt(req.query.limit) || 10; // Default limit is 10
  const skip = parseInt(req.query.skip) || 0; // Default skip is 0

  if (!query) return res.status(400).json({ error: 'Query is required' });

  // Search in the database
  const dbResults = await getMedsFromDatabase(query, limit, skip);
  if (dbResults.length > 0 && (source === 'any' || source === 'mediq')) {
    return res.json(dbResults);
  }

  // Search in OpenFDA
  const openFdaResults = await getMedsFromOpenFDA(query, limit, skip);
  return res.json(openFdaResults);
};

// 🟢 Search DB
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}

export const getMedsFromDatabase = async (query, limit, skip) => {
  const escapedQuery = escapeRegex(query); // Escape the query
  const meds = await Medication.find({ name: { $regex: `.*${escapedQuery}.*`, $options: 'i' } })
    .skip(skip)
    .limit(limit);
  return meds.map(med => ({ id: med._id.toString(), name: med.name, manufacturer: med.manufacturer , composition: med.composition }));
};

// 🔵 Search OpenFDA
export const getMedsFromOpenFDA = async (query, limit, skip) => {
  try {
    const response = await axios.get('https://api.fda.gov/drug/label.json', {
      params: {
        search: `${query}`,
        limit,
        skip,
        api_key: OPENFDA_API_KEY,
      },
    });

    return response.data.results
      .filter(item => item.openfda?.brand_name?.[0] && item.openfda?.manufacturer_name?.[0])
      .map((item, index) => ({
      id: `openfda-${item.id}`,
      name: item.openfda.brand_name[0],
      manufacturer: item.openfda.manufacturer_name[0],
      }));
  } catch (err) {
    console.error('OpenFDA API error:', err.message);
    return [];
  }
};

// 🔴 Get med by ID (DB or OpenFDA)
export const getMedsFromId = async (req, res) => {
  const { id } = req.params;

  if (id.startsWith('openfda-')) {
    const result = await getMedsFromIdOpenFDA(id);
    return result ? res.json(result) : res.status(404).json({ error: 'OpenFDA med not found' });
  }

  const result = await getMedsFromIdDatabase(id);
  return result ? res.json(result) : res.status(404).json({ error: 'Medicine not found in database' });
};

// 🟢 Get by DB ID
export const getMedsFromIdDatabase = async (id) => {
  try {
    const med = await Medication.findById(id);
    if (!med) return null;
    return { id: med._id.toString(), name: med.name, composition: med.composition, manufacturer: med.manufacturer,  usage: med.usage, precautions: med.precautions };
  } catch {
    return null;
  }
};

// 🔵 Get by OpenFDA ID
export const getMedsFromIdOpenFDA = async (id) => {
  // Extract the numeric ID from the `openfda-{id}` format
  const openFdaId = id.split('openfda-')[1];
  try {
    // Fetch data from OpenFDA
    const response = await axios.get(`https://api.fda.gov/drug/label.json`, {
      params: {
        search: `id:${openFdaId}`, // Use the extracted ID to search
        api_key: OPENFDA_API_KEY,
      },
    });

    const item = response.data.results[0]; // Get the first result
    if (!item) return null;

    // Return the formatted response
    return {
      id,
      name: item.openfda?.brand_name?.[0] || 'Unknown',
      manufacturer: item.openfda?.manufacturer_name?.[0] || 'Unknown',
      composition: item.openfda?.generic_name?.[0] || 'Unknown',
      usage: item.indications_and_usage?.[0] || 'No usage information available',
      precautions: item.warnings?.[0] || 'No precautions available',
      sideEffects: item.adverse_reactions?.[0] || 'No side effects available',
      storageInstructions: item.storage_and_handling?.[0] || 'No storage instructions available',
      activeIngredients: item.active_ingredient?.[0] || 'No active ingredients available',
      inactiveIngredients: item.inactive_ingredient?.[0] || 'No inactive ingredients available',
      dosageAndAdministration: item.dosage_and_administration?.[0] || 'No dosage information available',
      purpose: item.purpose?.[0] || 'No purpose information available',
      warnings: item.warnings?.[0] || 'No warnings available',
      askDoctor: item.ask_doctor?.[0] || 'No doctor consultation information available',
      stopUse: item.stop_use?.[0] || 'No stop use information available',
      pregnancyOrBreastFeeding: item.pregnancy_or_breast_feeding?.[0] || 'No pregnancy or breastfeeding information available',
      keepOutOfReachOfChildren: item.keep_out_of_reach_of_children?.[0] || 'No child safety information available',
      questions: item.questions?.[0] || 'No contact information available',
    };
  } catch (err) {
    console.error('OpenFDA API error:', err.message);
    return null;
  }
};
