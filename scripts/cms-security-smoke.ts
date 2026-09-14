import { randomInt } from "node:crypto";
import { createCareerFormToken, verifyCareerFormToken } from "../lib/career-form-token";
import { checkCareerSubmissionRate, consumeCareerFormToken } from "../lib/career-rate-limit";

const token = createCareerFormToken();
if (!verifyCareerFormToken(token)) throw new Error("A freshly signed career token was rejected.");
if (verifyCareerFormToken(`${token}x`)) throw new Error("A tampered career token was accepted.");
if (!await consumeCareerFormToken(token)) throw new Error("A fresh career token could not be consumed.");
if (await consumeCareerFormToken(token)) throw new Error("A career token could be consumed twice.");

const request = new Request("http://localhost/api/careers/apply", {
  method: "POST",
  headers: { "x-real-ip": `192.0.2.${randomInt(1, 255)}` },
});
const rate = await checkCareerSubmissionRate(request);
if (!rate.allowed) throw new Error("The careers rate limiter rejected its smoke-test identity.");

console.log("Career abuse-protection smoke check passed.");
process.exit(0);
