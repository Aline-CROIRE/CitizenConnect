const mongoose = require("mongoose")
const Category = require("../models/Category")


// Connect to database
const dotenv = require("dotenv")

// Load env vars
dotenv.config({ path: "./config/config.env" })

// Connect to DB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://niyocroirealine:kim123@cluster0.ufciukm.mongodb.net/ConnectClient", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


// Rwanda-specific categories
const categories = [
  {
    name: "Water & Sanitation",
    nameKinyarwanda: "Amazi n'Isuku",
    nameFrench: "Eau et Assainissement",
    description: "Issues related to water supply, quality, and sanitation services",
    descriptionKinyarwanda: "Ibibazo bijyanye n'amazi, ubwiza bwayo, na serivisi z'isuku",
    descriptionFrench: "Problèmes liés à l'approvisionnement en eau, à la qualité et aux services d'assainissement",
    department: "WASAC",
    icon: "droplet",
  },
  {
    name: "Roads & Infrastructure",
    nameKinyarwanda: "Imihanda n'Ibikorwa remezo",
    nameFrench: "Routes et Infrastructure",
    description: "Issues related to roads, bridges, public buildings, and other infrastructure",
    descriptionKinyarwanda: "Ibibazo bijyanye n'imihanda, ibiraro, inyubako za leta, n'ibindi bikorwa remezo",
    descriptionFrench: "Problèmes liés aux routes, ponts, bâtiments publics et autres infrastructures",
    department: "RTDA",
    icon: "road",
  },
  {
    name: "Electricity",
    nameKinyarwanda: "Amashanyarazi",
    nameFrench: "Électricité",
    description: "Issues related to electricity supply, outages, and connections",
    descriptionKinyarwanda: "Ibibazo bijyanye n'amashanyarazi, ihagarara ryayo, no guhuza",
    descriptionFrench: "Problèmes liés à l'approvisionnement en électricité, aux pannes et aux connexions",
    department: "REG",
    icon: "zap",
  },
  {
    name: "Healthcare",
    nameKinyarwanda: "Ubuzima",
    nameFrench: "Soins de Santé",
    description: "Issues related to healthcare services, facilities, and access",
    descriptionKinyarwanda: "Ibibazo bijyanye na serivisi z'ubuzima, ibikorwa remezo, no kubona ubuvuzi",
    descriptionFrench: "Problèmes liés aux services de santé, aux installations et à l'accès",
    department: "Ministry of Health",
    icon: "activity",
  },
  {
    name: "Education",
    nameKinyarwanda: "Uburezi",
    nameFrench: "Éducation",
    description: "Issues related to schools, universities, and educational services",
    descriptionKinyarwanda: "Ibibazo bijyanye n'amashuri, za kaminuza, na serivisi z'uburezi",
    descriptionFrench: "Problèmes liés aux écoles, aux universités et aux services éducatifs",
    department: "Ministry of Education",
    icon: "book",
  },
  {
    name: "Security",
    nameKinyarwanda: "Umutekano",
    nameFrench: "Sécurité",
    description: "Issues related to public safety, crime, and security concerns",
    descriptionKinyarwanda: "Ibibazo bijyanye n'umutekano rusange, ibyaha, n'ibindi bibazo by'umutekano",
    descriptionFrench: "Problèmes liés à la sécurité publique, à la criminalité et aux préoccupations de sécurité",
    department: "Rwanda National Police",
    icon: "shield",
  },
  {
    name: "Land & Housing",
    nameKinyarwanda: "Ubutaka n'Imiturire",
    nameFrench: "Terre et Logement",
    description: "Issues related to land disputes, housing, and property rights",
    descriptionKinyarwanda: "Ibibazo bijyanye n'impaka z'ubutaka, imiturire, n'uburenganzira ku mutungo",
    descriptionFrench: "Problèmes liés aux litiges fonciers, au logement et aux droits de propriété",
    department: "Rwanda Land Management and Use Authority",
    icon: "home",
  },
  {
    name: "Agriculture",
    nameKinyarwanda: "Ubuhinzi n'Ubworozi",
    nameFrench: "Agriculture",
    description: "Issues related to farming, livestock, and agricultural services",
    descriptionKinyarwanda: "Ibibazo bijyanye n'ubuhinzi, ubworozi, na serivisi z'ubuhinzi",
    descriptionFrench: "Problèmes liés à l'agriculture, à l'élevage et aux services agricoles",
    department: "Ministry of Agriculture",
    icon: "plant",
  },
  {
    name: "Environment",
    nameKinyarwanda: "Ibidukikije",
    nameFrench: "Environnement",
    description: "Issues related to environmental protection, pollution, and conservation",
    descriptionKinyarwanda: "Ibibazo bijyanye no kurengera ibidukikije, ihumana, no kubungabunga",
    descriptionFrench: "Problèmes liés à la protection de l'environnement, à la pollution et à la conservation",
    department: "REMA",
    icon: "tree",
  },
  {
    name: "Public Transport",
    nameKinyarwanda: "Gutwara Abantu n'Ibintu",
    nameFrench: "Transport Public",
    description: "Issues related to public transportation services and infrastructure",
    descriptionKinyarwanda: "Ibibazo bijyanye na serivisi zo gutwara abantu n'ibintu n'ibikorwa remezo",
    descriptionFrench: "Problèmes liés aux services de transport public et aux infrastructures",
    department: "RURA",
    icon: "bus",
  },
  {
    name: "ICT & Digital Services",
    nameKinyarwanda: "Ikoranabuhanga na Serivisi Koranabuhanga",
    nameFrench: "TIC et Services Numériques",
    description: "Issues related to internet, telecommunications, and digital government services",
    descriptionKinyarwanda: "Ibibazo bijyanye n'interineti, itumanaho, na serivisi za leta koranabuhanga",
    descriptionFrench: "Problèmes liés à l'internet, aux télécommunications et aux services gouvernementaux numériques",
    department: "Ministry of ICT",
    icon: "wifi",
  },
  {
    name: "Corruption & Ethics",
    nameKinyarwanda: "Ruswa n'Imyitwarire",
    nameFrench: "Corruption et Éthique",
    description: "Reports of corruption, bribery, or unethical conduct by public officials",
    descriptionKinyarwanda: "Raporo z'ibikorwa bya ruswa, gutanga ruswa, cyangwa imyitwarire mibi y'abakozi ba leta",
    descriptionFrench:
      "Rapports de corruption, de pots-de-vin ou de conduite contraire à l'éthique par des fonctionnaires",
    department: "Office of the Ombudsman",
    icon: "alert-triangle",
  },
]

// Import categories to database
const importData = async () => {
  try {
    await Category.deleteMany()
    await Category.insertMany(categories)

    console.log("Categories imported successfully")
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

// Delete all categories
const deleteData = async () => {
  try {
    await Category.deleteMany()

    console.log("Categories deleted successfully")
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

// Check command line arguments
if (process.argv[2] === "-i") {
  importData()
} else if (process.argv[2] === "-d") {
  deleteData()
} else {
  console.log("Please add proper command: -i (import) or -d (delete)")
  process.exit()
}
