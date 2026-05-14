import { type Plugin, defineConfig } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

import type { FlightLogEntry } from "../types/FlightLogEntry";
import type { LogFlightRequest } from "../types/LogFlightRequest";

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body, null, 2));
}

function sendError(response: ServerResponse, statusCode: number, message: string): void {
  sendJson(response, statusCode, { error: message });
}

async function readRequestBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
      continue;
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function parseLogFlightRequest(requestBody: string): LogFlightRequest {
  const parsedBody: unknown = JSON.parse(requestBody);

  if (
    typeof parsedBody !== "object" ||
    parsedBody === null ||
    !("hours" in parsedBody) ||
    typeof parsedBody.hours !== "number" ||
    !Number.isFinite(parsedBody.hours) ||
    parsedBody.hours <= 0 ||
    !("tailNumber" in parsedBody) ||
    typeof parsedBody.tailNumber !== "string" ||
    parsedBody.tailNumber.trim().length === 0
  ) {
    throw new Error(
      `Expected JSON body with positive numeric hours and non-empty tailNumber fields. Body: ${requestBody}`
    );
  }

  return {
    hours: parsedBody.hours,
    tailNumber: parsedBody.tailNumber.trim()
  };
}

async function readFlights(): Promise<FlightLogEntry[]> {
  const fileContents: string = await readFile(flightsFilePath, "utf-8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected flights file to contain an array. File: ${flightsFilePath}`);
  }

  return parsedContents as FlightLogEntry[];
}

async function writeFlights(flights: FlightLogEntry[]): Promise<void> {
  await mkdir(dirname(flightsFilePath), { recursive: true });
  await writeFile(flightsFilePath, `${JSON.stringify(flights, null, 2)}\n`, "utf-8");
}

function createFlight(hours: number, tailNumber: string): FlightLogEntry {
  return {
    hours,
    id: crypto.randomUUID(),
    loggedAt: new Date().toISOString(),
    tailNumber
  };
}

const flightsFilePath: string = resolve(process.cwd(), "data/flights.json");

export default function flightLogApiPlugin(): Plugin {
  return {
    name: "flight-log-api",
    configureServer(server) {
      server.middlewares.use("/api/flights", async (request, response) => {
        try {
          if (request.method === "GET") {
            sendJson(response, 200, await readFlights());
            return;
          }

          if (request.method === "POST") {
            const requestBody: string = await readRequestBody(request);
            const logFlightRequest: LogFlightRequest = parseLogFlightRequest(requestBody);
            const flights: FlightLogEntry[] = await readFlights();
            const flight: FlightLogEntry = createFlight(logFlightRequest.hours, logFlightRequest.tailNumber);

            await writeFlights([...flights, flight]);
            sendJson(response, 201, flight);
            return;
          }

          sendError(response, 405, `Unsupported method for /api/flights: ${request.method}`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            sendError(response, 500, error.message);
            return;
          }

          throw error;
        }
      });
    }
  };
}