import axios from "axios";
import { config } from "../config/env.js";

const AUTH_HEADER =
  "Basic " + Buffer.from(`${config.BASIC_USER}:${config.BASIC_PASS}`).toString("base64");

export async function fetchSSR(url) {
  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Googlebot",
      Authorization: AUTH_HEADER
    },
    validateStatus: () => true
  });

  return { status: res.status, html: res.data };
}
