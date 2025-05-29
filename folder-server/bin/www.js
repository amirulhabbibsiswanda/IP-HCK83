const app = require("../app");
const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config;
}

app.listen(PORT, () => {
  console.log("running into tes port", PORT);

})