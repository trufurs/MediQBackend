import  {Medication}  from '../models/mediciene.js';
import asyncHandler from 'express-async-handler';

const getMediciene = asyncHandler(async (res , req) => {    
    const mediciene = await Medication.find({});
    res.json(mediciene);
});

const getMedicieneById = asyncHandler(async (res , req) => {
    const mediciene = await Medication.findById(req.params.id);
    if(mediciene){
        res.json(mediciene);
    }else{
        res.status(404).json({message: 'Mediciene not found'});
    }
});

const createMediciene = asyncHandler(async (res , req) => {
    const mediciene = new Medication({
        name: 'Sample name',
        dosage: 'Sample dosage',
        form: 'Sample form',
        indications: 'Sample indications',
        administrationRoute: 'Sample administration route',
        frequency: 'Sample frequency',
        startDate: new Date(),
        endDate: new Date(),
        sideEffects: ['Sample side effect'],
        contraindications: ['Sample contraindication'],
        precautions: ['Sample precaution'],
        storageInstructions: 'Sample storage instructions',
        prescribedBy: 'Sample doctor'
    });
    const createdMediciene = await mediciene.save();
    res.status(201).json(createdMediciene);
});

const updateMediciene = asyncHandler(async (res , req) => {
    const {name, dosage, form, indications, administrationRoute, frequency, startDate, endDate, sideEffects, contraindications, precautions, storageInstructions, prescribedBy} = req.body;
    const mediciene = await Medication.findById(req.params.id);
    if(mediciene){
        mediciene.name = name;
        mediciene.dosage = dosage;
        mediciene.form = form;
        mediciene.indications = indications;
        mediciene.administrationRoute = administrationRoute;
        mediciene.frequency = frequency;
        mediciene.startDate = startDate;
        mediciene.endDate = endDate;
        mediciene.sideEffects = sideEffects;
        mediciene.contraindications = contraindications;
        mediciene.precautions = precautions;
        mediciene.storageInstructions = storageInstructions;
        mediciene.prescribedBy = prescribedBy;

        const updatedMediciene = await mediciene.save();
        res.json(updatedMediciene);
    }else{
        res.status(404).json({message: 'Mediciene not found'});
    }
});

const deleteMediciene = asyncHandler(async (res , req) => {
    const mediciene = await Medication.findById(req.params.id);
    if(mediciene){
        await mediciene.remove();
        res.json({message: 'Mediciene removed'});
    }else{
        res.status(404).json({message: 'Mediciene not found'});
    }
});

export {getMediciene, getMedicieneById, createMediciene, updateMediciene, deleteMediciene};
