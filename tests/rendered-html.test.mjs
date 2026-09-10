import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("static build contains branded entry metadata", async () => {
  const html = await readFile(new URL("dist-cn/index.html", root), "utf8");
  assert.match(html, /贸证贯通/);
  assert.match(html, /og\.png/);
  assert.match(html, /可信AI/);
});

test("product source exposes TEG-ESE, CAV and human-review boundary", async () => {
  const source = await readFile(new URL("app/components/DemoApp.tsx", root), "utf8");
  assert.match(source, /TEG · ESE/);
  assert.match(source, /CAV · TRUSTED EXECUTION/);
  assert.match(source, /AUTO_REMIT/);
  assert.match(source, /系统不认定可疑交易/);
});

test("all retained demonstration assets exist", async () => {
  const files = [
    "public/demo-documents/sales_contract_demo.pdf",
    "public/demo-documents/commercial_invoice_demo.pdf",
    "public/demo-documents/packing_list_demo.pdf",
    "public/demo-documents/bill_of_lading_demo.pdf",
    "public/demo-documents/certificate_of_origin_demo.pdf",
    "public/demo-data/customs-declaration.json",
    "public/demo-data/payment-instruction.json",
    "public/demo-data/assurance-certificate.json",
    "materials/regulations/SAFE_bank_fx_practice_trial.pdf",
    "materials/source_manifest.csv",
  ];
  await Promise.all(files.map((file) => access(new URL(file, root))));
});

test("synthetic data is explicitly labelled", async () => {
  const customs = JSON.parse(await readFile(new URL("public/demo-data/customs-declaration.json", root), "utf8"));
  const payment = JSON.parse(await readFile(new URL("public/demo-data/payment-instruction.json", root), "utf8"));
  assert.equal(customs.synthetic, true);
  assert.equal(payment.synthetic, true);
  assert.equal(payment.executionStatus, "HELD_FOR_HUMAN_REVIEW");
});
