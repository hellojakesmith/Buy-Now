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
  assert.equal(normalizeFieldType("Multiple Choice"), "radio");
  assert.equal(normalizeFieldType("Checkboxes"), "checkbox");
  assert.equal(normalizeFieldType("Website"), "url");
  assert.equal(normalizeFieldType("Multi-select"), "multiselect");
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

test("validates number, URL, and text length rules", () => {
  const advancedFields = [
    { key: "age", label: "Age", type: "number", required: true, validation: { min: 18, max: 100 } },
    { key: "website", label: "Website", type: "url", required: true },
    { key: "bio", label: "Bio", type: "text", validation: { minLength: 5, maxLength: 20 } },
  ];

  const answers = validateFormAnswers(advancedFields, {
    age: "35",
    website: "https://example.com",
    bio: "Hello world",
  });

  assert.equal(answers.age, 35);
  assert.equal(answers.website, "https://example.com");

  assert.throws(() => validateFormAnswers(advancedFields, {
    age: "17",
    website: "https://example.com",
    bio: "Hello world",
  }));

  assert.throws(() => validateFormAnswers(advancedFields, {
    age: "35",
    website: "not-a-url",
    bio: "Hello world",
  }));

  assert.throws(() => validateFormAnswers(advancedFields, {
    age: "35",
    website: "https://example.com",
    bio: "hey",
  }));
});

test("validates multi-select values against allowed options", () => {
  const advancedFields = [{ key: "goals", label: "Goals", type: "multiselect", required: true, options: ["Leads", "Sales", "Brand"] }];
  const answers = validateFormAnswers(advancedFields, { goals: ["Leads", "Sales"] });
  assert.deepEqual(answers.goals, ["Leads", "Sales"]);
  assert.throws(() => validateFormAnswers(advancedFields, { goals: ["Leads", "Unknown"] }));
});
