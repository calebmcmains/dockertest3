const mongoose = require("mongoose"); // brings in mongoosse, required for working with MongoDB
const User = require("../models/user");

mongoose
  .connect("mongodb://localhost:27017/docker-test-db")
  .then(() => {
    console.log("MONGO-DB CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGO-DB ERROR");
    console.log(err);
    process.exit(1);
  });

const seedDB = async () => {
  await User.deleteMany({});

  const newUser1 = new User({
    firstname: "Ronald",
    lastname: "Sams",
    email: "ronaldsams@ronaldsams.com",
    hobbies: "biking",
  });
  await newUser1.save();

  const newUser2 = new User({
    firstname: "Taryn",
    lastname: "Omans",
    email: "tarynomans@tarynomans.com",
    hobbies: "space exploration",
  });
  await newUser2.save();

  const newUser3 = new User({
    firstname: "Wayne",
    lastname: "Yakama",
    email: "wayneyakama@wayneyakama.com",
    hobbies: "soccer",
  });
  await newUser3.save();
};

seedDB().then(() => {
  mongoose.connection.close();
});
