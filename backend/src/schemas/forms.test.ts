import assert from "node:assert/strict";
import { test } from "node:test";
import { AppError } from "../utils/errors.ts";
import { normalizeFieldType, validateFormAnswers } from "./forms.ts";

const fields = [
  { key: "name", label: "Name", type: "Short Text", required: true },
  { key: "email", label: "Email", type: "Email", required: true },
  { key: "topic", label: "Topic", type: "Dropdown", required: false, options: ["A", "B"] },
];

test("normalizes legacy field type labels", () => {
  assert.equal(normalizeFieldType("Short Text"), "text");
  assert.equal(normalizeFieldType("Multiple Choice"), "select");
  assert.equal(normalizeFieldType("Checkboxes"), "checkbox");
});

test("rejects missing required answers", () => {
  assert.throws(
    () => validateFormAnswers(fields, { email: "ada@example.com" }),
    (error: unknown) => error instanceof AppError && error.statusCode === 400,
  );
});

test("accepts a valid submission and lowercases email", () => {
  const answers = validateFormAnswers(fields, { name: "Ada", email: "Ada@Example.com", topic: "A" });
  assert.equal(answers.email, "ada@example.com");
  assert.equal(answers.name, "Ada");
});

test("rejects select values outside the option list", () => {
  assert.throws(() => validateFormAnswers(fields, { name: "Ada", email: "ada@example.com", topic: "Z" }));
});
