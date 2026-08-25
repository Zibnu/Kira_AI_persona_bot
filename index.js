const express = require("express");

const app = express();
app.use(express.json());
require("dotenv").config();


app.get("/", (req, res) => {
    res.json({
        message: "success",
    })
})

const PORT = process.env.PORT;
if(process.env.NODE_ENV !== "productin") {
    app.listen(PORT, () => console.log("Server is Running"));
}
