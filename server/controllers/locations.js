const asyncHandler = require("../middleware/async")
const Location = require("../models/Location")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all provinces
// @route   GET /api/locations/provinces
// @access  Public
exports.getProvinces = asyncHandler(async (req, res, next) => {
  try {
    console.log("Fetching provinces...");
    
    // Default provinces in case database is empty
    const defaultProvinces = [
      { _id: "p1", name: "Kigali City" },
      { _id: "p2", name: "Northern Province" },
      { _id: "p3", name: "Southern Province" },
      { _id: "p4", name: "Eastern Province" },
      { _id: "p5", name: "Western Province" }
    ];
    
    // Try to get provinces from database
    const provinces = await Location.find().distinct("province");
    
    // Create an array of province objects with _id and name
    let provinceObjects = [];
    
    if (provinces && provinces.length > 0) {
      provinceObjects = provinces.map((province) => ({
        _id: province,
        name: province,
      }));
    } else {
      // Use default provinces if none found in database
      provinceObjects = defaultProvinces;
    }
    
    console.log(`Returning ${provinceObjects.length} provinces`);
    
    res.status(200).json({
      success: true,
      count: provinceObjects.length,
      data: provinceObjects,
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    
    // Return default provinces in case of error
    const defaultProvinces = [
      { _id: "p1", name: "Kigali City" },
      { _id: "p2", name: "Northern Province" },
      { _id: "p3", name: "Southern Province" },
      { _id: "p4", name: "Eastern Province" },
      { _id: "p5", name: "Western Province" }
    ];
    
    res.status(200).json({
      success: true,
      count: defaultProvinces.length,
      data: defaultProvinces,
    });
  }
})

// @desc    Get districts by province
// @route   GET /api/locations/districts/:provinceId
// @access  Public
exports.getDistricts = asyncHandler(async (req, res, next) => {
  try {
    const province = req.params.provinceId;
    console.log(`Fetching districts for province: ${province}`);
    
    // Default districts for each province in case database is empty
    const defaultDistricts = {
      "p1": [
        { _id: "d1", name: "Nyarugenge" },
        { _id: "d2", name: "Gasabo" },
        { _id: "d3", name: "Kicukiro" }
      ],
      "p2": [
        { _id: "d4", name: "Musanze" },
        { _id: "d5", name: "Burera" },
        { _id: "d6", name: "Gakenke" },
        { _id: "d7", name: "Gicumbi" },
        { _id: "d8", name: "Rulindo" }
      ],
      "p3": [
        { _id: "d9", name: "Gisagara" },
        { _id: "d10", name: "Huye" },
        { _id: "d11", name: "Kamonyi" },
        { _id: "d12", name: "Muhanga" },
        { _id: "d13", name: "Nyamagabe" },
        { _id: "d14", name: "Nyanza" },
        { _id: "d15", name: "Nyaruguru" },
        { _id: "d16", name: "Ruhango" }
      ],
      "p4": [
        { _id: "d17", name: "Bugesera" },
        { _id: "d18", name: "Gatsibo" },
        { _id: "d19", name: "Kayonza" },
        { _id: "d20", name: "Kirehe" },
        { _id: "d21", name: "Ngoma" },
        { _id: "d22", name: "Nyagatare" },
        { _id: "d23", name: "Rwamagana" }
      ],
      "p5": [
        { _id: "d24", name: "Karongi" },
        { _id: "d25", name: "Ngororero" },
        { _id: "d26", name: "Nyabihu" },
        { _id: "d27", name: "Nyamasheke" },
        { _id: "d28", name: "Rubavu" },
        { _id: "d29", name: "Rusizi" },
        { _id: "d30", name: "Rutsiro" }
      ]
    };
    
    // Try to get districts from database
    const districts = await Location.find({ province }).distinct("district");
    
    // Create an array of district objects with _id and name
    let districtObjects = [];
    
    if (districts && districts.length > 0) {
      districtObjects = districts.map((district) => ({
        _id: district,
        name: district,
      }));
    } else {
      // Use default districts if none found in database
      districtObjects = defaultDistricts[province] || [
        { _id: "d_generic_1", name: "District 1" },
        { _id: "d_generic_2", name: "District 2" },
        { _id: "d_generic_3", name: "District 3" }
      ];
    }
    
    console.log(`Returning ${districtObjects.length} districts for province ${province}`);
    
    res.status(200).json({
      success: true,
      count: districtObjects.length,
      data: districtObjects,
    });
  } catch (error) {
    console.error(`Error fetching districts for province ${req.params.provinceId}:`, error);
    
    // Return generic districts in case of error
    const genericDistricts = [
      { _id: "d_fallback_1", name: "District 1" },
      { _id: "d_fallback_2", name: "District 2" },
      { _id: "d_fallback_3", name: "District 3" }
    ];
    
    res.status(200).json({
      success: true,
      count: genericDistricts.length,
      data: genericDistricts,
    });
  }
})

// @desc    Get sectors by district
// @route   GET /api/locations/sectors/:districtId
// @access  Public
exports.getSectors = asyncHandler(async (req, res, next) => {
  try {
    const district = req.params.districtId;
    console.log(`Fetching sectors for district: ${district}`);
    
    // Default sectors for common districts in case database is empty
    const defaultSectors = {
      "d1": [
        { _id: "s1", name: "Gitega" },
        { _id: "s2", name: "Nyamirambo" },
        { _id: "s3", name: "Nyarugenge" },
        { _id: "s4", name: "Kimisagara" },
        { _id: "s5", name: "Muhima" },
        { _id: "s6", name: "Rwezamenyo" },
        { _id: "s7", name: "Nyakabanda" },
        { _id: "s8", name: "Mageragere" },
        { _id: "s9", name: "Kanyinya" },
        { _id: "s10", name: "Kigali" }
      ],
      "d2": [
        { _id: "s11", name: "Remera" },
        { _id: "s12", name: "Kacyiru" },
        { _id: "s13", name: "Kimironko" },
        { _id: "s14", name: "Gisozi" },
        { _id: "s15", name: "Kinyinya" },
        { _id: "s16", name: "Ndera" },
        { _id: "s17", name: "Nduba" },
        { _id: "s18", name: "Rusororo" },
        { _id: "s19", name: "Rutunga" },
        { _id: "s20", name: "Bumbogo" }
      ],
      "d3": [
        { _id: "s21", name: "Gahanga" },
        { _id: "s22", name: "Gatenga" },
        { _id: "s23", name: "Gikondo" },
        { _id: "s24", name: "Kagarama" },
        { _id: "s25", name: "Kanombe" },
        { _id: "s26", name: "Kicukiro" },
        { _id: "s27", name: "Kigarama" },
        { _id: "s28", name: "Masaka" },
        { _id: "s29", name: "Niboye" },
        { _id: "s30", name: "Nyarugunga" }
      ]
    };
    
    // Try to get sectors from database
    const sectors = await Location.find({ district }).distinct("sector");
    
    // Create an array of sector objects with _id and name
    let sectorObjects = [];
    
    if (sectors && sectors.length > 0) {
      sectorObjects = sectors.map((sector) => ({
        _id: sector,
        name: sector,
      }));
    } else {
      // Use default sectors if none found in database
      sectorObjects = defaultSectors[district] || [
        { _id: "s_generic_1", name: "Sector 1" },
        { _id: "s_generic_2", name: "Sector 2" },
        { _id: "s_generic_3", name: "Sector 3" },
        { _id: "s_generic_4", name: "Sector 4" },
        { _id: "s_generic_5", name: "Sector 5" }
      ];
    }
    
    console.log(`Returning ${sectorObjects.length} sectors for district ${district}`);
    
    res.status(200).json({
      success: true,
      count: sectorObjects.length,
      data: sectorObjects,
    });
  } catch (error) {
    console.error(`Error fetching sectors for district ${req.params.districtId}:`, error);
    
    // Return generic sectors in case of error
    const genericSectors = [
      { _id: "s_fallback_1", name: "Sector 1" },
      { _id: "s_fallback_2", name: "Sector 2" },
      { _id: "s_fallback_3", name: "Sector 3" }
    ];
    
    res.status(200).json({
      success: true,
      count: genericSectors.length,
      data: genericSectors,
    });
  }
})

// @desc    Get cells by sector
// @route   GET /api/locations/cells/:sectorId
// @access  Public
exports.getCells = asyncHandler(async (req, res, next) => {
  try {
    const sector = req.params.sectorId;
    console.log(`Fetching cells for sector: ${sector}`);
    
    // Default cells for common sectors in case database is empty
    const defaultCells = {
      "s1": [
        { _id: "c1", name: "Akabahizi" },
        { _id: "c2", name: "Gakinjiro" },
        { _id: "c3", name: "Kigarama" },
        { _id: "c4", name: "Kinyange" },
        { _id: "c5", name: "Kora" }
      ],
      "s2": [
        { _id: "c6", name: "Cyivugiza" },
        { _id: "c7", name: "Mumena" },
        { _id: "c8", name: "Mpazi" },
        { _id: "c9", name: "Rugarama" }
      ],
      "s11": [
        { _id: "c10", name: "Nyabisindu" },
        { _id: "c11", name: "Rukiri I" },
        { _id: "c12", name: "Rukiri II" },
        { _id: "c13", name: "Gisimenti" },
        { _id: "c14", name: "Nyarutarama" }
      ],
      "s12": [
        { _id: "c15", name: "Kamatamu" },
        { _id: "c16", name: "Kamutwa" },
        { _id: "c17", name: "Kibaza" },
        { _id: "c18", name: "Kabarondo" }
      ]
    };
    
    // Try to get cells from database
    const cells = await Location.find({ sector }).distinct("cell");
    
    // Create an array of cell objects with _id and name
    let cellObjects = [];
    
    if (cells && cells.length > 0) {
      cellObjects = cells.map((cell) => ({
        _id: cell,
        name: cell,
      }));
    } else {
      // Use default cells if none found in database
      cellObjects = defaultCells[sector] || [
        { _id: "c_generic_1", name: "Cell 1" },
        { _id: "c_generic_2", name: "Cell 2" },
        { _id: "c_generic_3", name: "Cell 3" },
        { _id: "c_generic_4", name: "Cell 4" },
        { _id: "c_generic_5", name: "Cell 5" }
      ];
    }
    
    console.log(`Returning ${cellObjects.length} cells for sector ${sector}`);
    
    res.status(200).json({
      success: true,
      count: cellObjects.length,
      data: cellObjects,
    });
  } catch (error) {
    console.error(`Error fetching cells for sector ${req.params.sectorId}:`, error);
    
    // Return generic cells in case of error
    const genericCells = [
      { _id: "c_fallback_1", name: "Cell 1" },
      { _id: "c_fallback_2", name: "Cell 2" },
      { _id: "c_fallback_3", name: "Cell 3" }
    ];
    
    res.status(200).json({
      success: true,
      count: genericCells.length,
      data: genericCells,
    });
  }
})

// @desc    Get villages by cell
// @route   GET /api/locations/villages/:cellId
// @access  Public
exports.getVillages = asyncHandler(async (req, res, next) => {
  try {
    const cell = req.params.cellId;
    console.log(`Fetching villages for cell: ${cell}`);
    
    // Default villages for common cells in case database is empty
    const defaultVillages = {
      "c1": [
        { _id: "v1", name: "Akabahizi" },
        { _id: "v2", name: "Amahoro" },
        { _id: "v3", name: "Inyarurembo" },
        { _id: "v4", name: "Umurava" }
      ],
      "c6": [
        { _id: "v5", name: "Cyivugiza" },
        { _id: "v6", name: "Gatare" },
        { _id: "v7", name: "Kamuhoza" },
        { _id: "v8", name: "Nyagakoki" }
      ],
      "c10": [
        { _id: "v9", name: "Amarembo" },
        { _id: "v10", name: "Rebero" },
        { _id: "v11", name: "Ruturusu I" },
        { _id: "v12", name: "Ruturusu II" }
      ],
      "c15": [
        { _id: "v13", name: "Gasabo" },
        { _id: "v14", name: "Gishushu" },
        { _id: "v15", name: "Kabarondo" },
        { _id: "v16", name: "Kamutwa" }
      ]
    };
    
    // Try to get villages from database
    const villages = await Location.find({ cell }).distinct("village");
    
    // Create an array of village objects with _id and name
    let villageObjects = [];
    
    if (villages && villages.length > 0) {
      villageObjects = villages.map((village) => ({
        _id: village,
        name: village,
      }));
    } else {
      // Use default villages if none found in database
      villageObjects = defaultVillages[cell] || [
        { _id: "v_generic_1", name: "Village 1" },
        { _id: "v_generic_2", name: "Village 2" },
        { _id: "v_generic_3", name: "Village 3" },
        { _id: "v_generic_4", name: "Village 4" },
        { _id: "v_generic_5", name: "Village 5" }
      ];
    }
    
    console.log(`Returning ${villageObjects.length} villages for cell ${cell}`);
    
    res.status(200).json({
      success: true,
      count: villageObjects.length,
      data: villageObjects,
    });
  } catch (error) {
    console.error(`Error fetching villages for cell ${req.params.cellId}:`, error);
    
    // Return generic villages in case of error
    const genericVillages = [
      { _id: "v_fallback_1", name: "Village 1" },
      { _id: "v_fallback_2", name: "Village 2" },
      { _id: "v_fallback_3", name: "Village 3" }
    ];
    
    res.status(200).json({
      success: true,
      count: genericVillages.length,
      data: genericVillages,
    });
  }
})
