import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const books = [
  {
    id: 1,
    name: "Chi Pheo",
    author: "ABC",
  },
  {
    id: 2,
    name: "Chien tranh va hoa binh",
    author: "DEF",
  },
];

app.post("/login", (req, res) => {
  const data = req.body;
  console.log(data);
  const acccessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
  res.json({ acccessToken });
});

function authenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    next();
  });
}

app.get("/books", authenToken, (req, res) => {
  res.json({ status: "success", data: books });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
