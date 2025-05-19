const mongoose = require("mongoose")
const Location = require("../models/Location")
const colors = require("colors")
const dotenv = require("dotenv")

// Load env vars
dotenv.config({ path: "./config/config.env" })

// Connect to DB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://niyocroirealine:kim123@cluster0.ufciukm.mongodb.net/ConnectClient", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Rwanda's administrative divisions
const rwandaLocations = [
  // Kigali Province
  {
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Gitega",
    cell: "Akabahizi",
    village: "Gihanga",
  },
  {
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Gitega",
    cell: "Akabahizi",
    village: "Akinyambo",
  },
  {
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Gitega",
    cell: "Akabahizi",
    village: "Amahoro",
  },
  {
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Gitega",
    cell: "Kigarama",
    village: "Ingenzi",
  },
  {
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Gitega",
    cell: "Kigarama",
    village: "Umucyo",
  },
  {
    province: "Kigali",
    district: "Gasabo",
    sector: "Kacyiru",
    cell: "Kamatamu",
    village: "Kamutwa",
  },
  {
    province: "Kigali",
    district: "Gasabo",
    sector: "Kacyiru",
    cell: "Kamatamu",
    village: "Kangondo",
  },
  {
    province: "Kigali",
    district: "Gasabo",
    sector: "Kimironko",
    cell: "Bibare",
    village: "Amajyambere",
  },
  {
    province: "Kigali",
    district: "Kicukiro",
    sector: "Niboye",
    cell: "Gatare",
    village: "Byimana",
  },

  // Eastern Province
  {
    province: "Eastern",
    district: "Bugesera",
    sector: "Nyamata",
    cell: "Kanazi",
    village: "Cyugamo",
  },
  {
    province: "Eastern",
    district: "Kayonza",
    sector: "Mukarange",
    cell: "Bwiza",
    village: "Kayonza",
  },
  {
    province: "Eastern",
    district: "Ngoma",
    sector: "Kibungo",
    cell: "Cyasemakamba",
    village: "Kabeza",
  },

  // Northern Province
  {
    province: "Northern",
    district: "Musanze",
    sector: "Muhoza",
    cell: "Cyabararika",
    village: "Rukoro",
  },
  {
    province: "Northern",
    district: "Gicumbi",
    sector: "Byumba",
    cell: "Gisuna",
    village: "Nyamabuye",
  },
  {
    province: "Northern",
    district: "Burera",
    sector: "Cyanika",
    cell: "Kabyiniro",
    village: "Kabaya",
  },

  // Southern Province
  {
    province: "Southern",
    district: "Huye",
    sector: "Ngoma",
    cell: "Butare",
    village: "Bukinanyana",
  },
  {
    province: "Southern",
    district: "Nyamagabe",
    sector: "Gasaka",
    cell: "Kigeme",
    village: "Gitaba",
  },
  {
    province: "Southern",
    district: "Nyanza",
    sector: "Busasamana",
    cell: "Nyanza",
    village: "Rwesero",
  },

  // Western Province
  {
    province: "Western",
    district: "Rubavu",
    sector: "Gisenyi",
    cell: "Kivumu",
    village: "Kabumba",
  },
  {
    province: "Western",
    district: "Karongi",
    sector: "Bwishyura",
    cell: "Kiniha",
    village: "Gitarama",
  },
  {
    province: "Western",
    district: "Rusizi",
    sector: "Kamembe",
    cell: "Gatenga",
    village: "Kamashangi",
  },
]

// Import into DB
const importData = async () => {
  try {
    await Location.deleteMany()
    await Location.create(rwandaLocations)

    console.log("Data Imported...".green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await Location.deleteMany()

    console.log("Data Destroyed...".red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === "-i") {
  importData()
} else if (process.argv[2] === "-d") {
  deleteData()
} else {
  console.log("Please add an argument: -i (import) or -d (delete)")
  process.exit()
}
