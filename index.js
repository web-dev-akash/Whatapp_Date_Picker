const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(express.json());
const watiAPI = process.env.WATI_API;
const token = process.env.WATI_TOKEN;
const PORT = process.env.PORT || 8080;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    if (token == AUTH_TOKEN) {
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const getWhatsappMessage = async (phone) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(
    `${watiAPI}/api/v1/getMessages/${phone}?pageSize=500`,
    config
  );
  // console.log(res.data);
  const data = res.data.messages.items;
  console.log("Before Filter");
  let msg = "";
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].text && data[i].text.includes("Book my free Olympiad Demo")) {
      msg = data[i].text;
      break;
    }
  }
  webinarDate = msg.substring(52, 60);
  webinarTime = msg.substring(71, 76);
  return { webinarDate, webinarTime };
};

app.post("/webinarDate", authMiddleware, async (req, res) => {
  try {
    const { phone } = req.body;
    const data = await getWhatsappMessage(phone);
    return res.status(200).send({
      data,
    });
  } catch (error) {
    return res.status(500).send({
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Your Server is Live 😘`);
});
