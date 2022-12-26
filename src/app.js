import "dotenv/config";
import axios from "axios";
import express from "express";
import qs from "qs";
import HttpsProxyAgent from "https-proxy-agent";

import { kidcity_log } from "./logger.js";
import { encrypt } from "./utils.js";

const agent = new HttpsProxyAgent(`${process.env.TRI_PROXY}`);

const app = express();

app.use(express.json());

app.post("/kidcity/getItem", async (req, res) => {
  try {
    const { branch_id } = req.body;

    let data = qs.stringify({
      "ACCESS-KDC-API": `${process.env.KIDCITY_ACCESS}`,
      branch_id: branch_id,
    });

    let config = {
      method: "post",
      url: `${process.env.KIDCITY_URL}/Transmart_getitemsales`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
      httpsAgent: agent,
      proxy: false,
    };
    kidcity_log.info("[request_data]", JSON.stringify(data));
    kidcity_log.info("[request_config]", JSON.stringify(config));

    axios(config)
      .then((response) => {
        kidcity_log.info("[response_success]", JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch((e) => {
        kidcity_log.error("[response_error]", JSON.stringify(e));
        res.json(e);
      });
  } catch (e) {
    kidcity_log.error("[catch_error]", JSON.stringify(e.message));
    res.json(e.message);
  }
});

app.post("/kidcity/saveTicket", async (req, res) => {
  try {
    const {
      branch_id,
      sales_date,
      item_id,
      item_name,
      quantity,
      amount,
      qr_code,
      approval_code,
      payment_type,
      reff_no,
      username,
    } = req.body;

    let data = qs.stringify({
      "ACCESS-KDC-API": `${process.env.KIDCITY_ACCESS}`,
      branch_id: branch_id,
      salesdate: sales_date,
      iteminventory_id: item_id,
      iteminventory_name: item_name,
      qty: quantity,
      amount: amount,
      QRCode: qr_code,
      ApprovalCode: approval_code,
      PaymentType: payment_type,
      reff_no: reff_no,
      username: username,
    });

    let config = {
      method: "post",
      url: `${process.env.KIDCITY_URL}/Transmart_insertlogticket`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
      httpsAgent: agent,
      proxy: false,
    };
    kidcity_log.info("[request_data]", JSON.stringify(data));
    kidcity_log.info("[request_config]", JSON.stringify(config));

    axios(config)
      .then((response) => {
        kidcity_log.info("[response_success]", JSON.stringify(response.data));
        res.json(response.data);
      })
      .catch((e) => {
        kidcity_log.error("[response_error]", JSON.stringify(e));
        res.json(e);
      });
  } catch (e) {
    kidcity_log.error("[catch_error]", JSON.stringify(e.message));
    res.json(e.message);
  }
});

app.post("/kidcity/callme", async (req, res) => {
  try {
    const clientId = req.headers["client_id"];
    const time = req.headers["time"];
    const signature = req.headers["signature"];

    const bodyString = JSON.stringify(req.body);
    const bodyBase64 = Buffer.from(bodyString).toString("base64");
    const hashWord = `${clientId}${time}${bodyBase64}`;

    const hmac = encrypt(hashWord);

    if (signature === hmac) {
      res.status(200).json({ message: "OKE" });
    } else {
      res.status(401).json({ message: "BAD REQUEST" });
    }
  } catch (e) {
    kidcity_log.error("[catch_error]", JSON.stringify(e.message));
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, process.env.IP_SERVER).on("listening", () => {
  console.log(`🚀 are live on ${process.env.PORT}`);
});
