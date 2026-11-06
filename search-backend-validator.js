import axios from "axios";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL =
  process.env.START_URL.replace(/\/$/, "");

const results = [];

const TEST_QUERIES = [
  "ufc",
  "Programação",
  "Результаты",
  "L'ascension",
  "鶴屋怜",
  "권원일",
  "Pesajes",
  "aaaaaaaaaaaaaaaaaaaa"
];

const SEARCH_TYPES = [
  "all",
  "videos",
  "articles",
  "galleries"
];

async function validateSearch(query, type) {
  const start = Date.now();

  try {
    const encoded =
      encodeURIComponent(query);

    const url =
      `${BASE_URL}/search?query=${encoded}&type=${type}`;

    const response =
      await axios.get(url, {
        validateStatus: () => true,
        headers: {
          Accept: "*/*",
          RSC: "1"
        }
      });

    const end = Date.now();

    const responseTime =
      end - start;

    const issues = [];

    if (response.status !== 200) {
      issues.push(
        `Unexpected status ${response.status}`
      );
    }

    const payload =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);

    if (
      payload
        .toLowerCase()
        .includes("internal server error")
    ) {
      issues.push(
        "Server error in response"
      );
    }

    if (
      payload
        .toLowerCase()
        .includes("application error")
    ) {
      issues.push(
        "Application error"
      );
    }

    if (
      payload
        .toLowerCase()
        .includes("error:")
    ) {
      issues.push(
        "Unexpected error payload"
      );
    }

    if (
      responseTime > 3000
    ) {
      issues.push(
        "Slow response"
      );
    }

    let noResults = false;

    if (
      query ===
      "aaaaaaaaaaaaaaaaaaaa"
    ) {
      noResults =
        payload.length < 1000;

      if (!noResults) {
        issues.push(
          "Expected no results state"
        );
      }
    }

    results.push({
      query,
      type,
      status: response.status,
      responseTime,
      payloadLength:
        payload.length,
      noResults,
      issues:
        issues.length === 0
          ? "PASS"
          : issues.join("; ")
    });

  } catch (err) {

    results.push({
      query,
      type,
      status: "ERROR",
      responseTime: null,
      payloadLength: null,
      noResults: null,
      issues: err.message
    });

  }
}

async function main() {

  console.log(
    "Running search backend validation..."
  );

  for (
    const type of SEARCH_TYPES
  ) {

    for (
      const query of TEST_QUERIES
    ) {

      await validateSearch(
        query,
        type
      );

    }
  }

  fs.writeFileSync(
    "search-report.json",
    JSON.stringify(
      results,
      null,
      2
    )
  );

  const csvWriter =
    createObjectCsvWriter({
      path: "search-report.csv",
      header: [
        {
          id: "query",
          title: "QUERY"
        },
        {
          id: "type",
          title: "TYPE"
        },
        {
          id: "status",
          title: "STATUS"
        },
        {
          id: "responseTime",
          title:
            "RESPONSE_TIME_MS"
        },
        {
          id: "payloadLength",
          title:
            "PAYLOAD_LENGTH"
        },
        {
          id: "noResults",
          title:
            "NO_RESULTS"
        },
        {
          id: "issues",
          title: "ISSUES"
        }
      ]
    });

  await csvWriter.writeRecords(
    results
  );

  console.log(
    "Search report generated: search-report.json and search-report.csv"
    );
}