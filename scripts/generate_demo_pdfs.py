from pathlib import Path
from shutil import copy2

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_OUTPUT = ROOT / "public" / "demo-documents"
ARCHIVE_OUTPUT = ROOT / "output" / "pdf"

GREEN = colors.HexColor("#123D32")
PALE = colors.HexColor("#EAF1ED")
GOLD = colors.HexColor("#B1955B")
INK = colors.HexColor("#1E2924")
MUTED = colors.HexColor("#68736E")
LINE = colors.HexColor("#D7DED9")
RED = colors.HexColor("#A3212B")


DOCUMENTS = {
    "sales_contract_demo.pdf": {
        "code": "CUSTOMER-CONTROLLED / SYNTHETIC",
        "title": "SALES CONTRACT",
        "subtitle": "Machinery Supply Agreement",
        "number": "NW-WH-2026-0418",
        "rows": [
            ("Buyer", "WUHAN HUAYUAN ELECTROMECHANICAL EQUIPMENT CO., LTD."),
            ("Seller", "NORDWERK PUMPS GMBH"),
            ("Commodity", "NW-80 CENTRIFUGAL PUMPS"),
            ("Contract Quantity", "1,000 PCS"),
            ("Unit Price", "USD 1,000.00 / PCS"),
            ("Contract Value", "USD 1,000,000.00"),
            ("Trade Term", "CIF SHANGHAI, INCOTERMS 2020"),
            ("Partial Shipment", "ALLOWED"),
        ],
        "notes": [
            "Clause 11.2 - Partial shipment is allowed subject to commercial documents for each batch.",
            "Payment may be made by cross-border remittance against the current shipment documents.",
        ],
    },
    "commercial_invoice_demo.pdf": {
        "code": "CUSTOMER-CONTROLLED / SYNTHETIC",
        "title": "COMMERCIAL INVOICE",
        "subtitle": "Invoice submitted for current remittance",
        "number": "INV-2026-0910",
        "rows": [
            ("Seller", "NORDWERK PUMPS GMBH"),
            ("Buyer", "WUHAN HUAYUAN ELECTROMECHANICAL EQUIPMENT CO., LTD."),
            ("Contract No.", "NW-WH-2026-0418"),
            ("Commodity", "NW-80 CENTRIFUGAL PUMPS"),
            ("Invoice Quantity", "1,000 PCS"),
            ("Unit Price", "USD 800.00 / PCS"),
            ("Invoice Amount", "USD 800,000.00"),
            ("Trade Term", "CIF SHANGHAI"),
        ],
        "notes": [
            "Demo exception: the invoice quantity states 1,000 PCS while independent shipment evidence states 800 PCS.",
            "No customer correction letter is included in the current evidence package.",
        ],
    },
    "packing_list_demo.pdf": {
        "code": "CUSTOMER-CONTROLLED / SYNTHETIC",
        "title": "PACKING LIST",
        "subtitle": "Packing declaration for current shipment",
        "number": "PL-2026-0910",
        "rows": [
            ("Exporter", "NORDWERK PUMPS GMBH"),
            ("Consignee", "WUHAN HUAYUAN ELECTROMECHANICAL EQUIPMENT CO., LTD."),
            ("Marks", "WH / NW / 0910"),
            ("Commodity", "NW-80 CENTRIFUGAL PUMPS"),
            ("Packing Quantity", "1,000 PCS"),
            ("Packages", "80 WOODEN CRATES"),
            ("Gross Weight", "48,600 KGS"),
            ("Net Weight", "45,200 KGS"),
        ],
        "notes": [
            "Demo exception: the packing quantity has not been revised to match the 800 PCS shown on the bill of lading.",
        ],
    },
    "bill_of_lading_demo.pdf": {
        "code": "INDEPENDENT EVIDENCE / SYNTHETIC",
        "title": "OCEAN BILL OF LADING",
        "subtitle": "OceanBridge Lines - shipped on board",
        "number": "OBLHAMSHA260817",
        "rows": [
            ("Shipper", "NORDWERK PUMPS GMBH"),
            ("Consignee", "WUHAN HUAYUAN ELECTROMECHANICAL EQUIPMENT CO., LTD."),
            ("Vessel / Voyage", "MV NORDLIGHT / NL0826E"),
            ("Port of Loading", "HAMBURG, GERMANY"),
            ("Port of Discharge", "SHANGHAI, CHINA"),
            ("Goods", "NW-80 CENTRIFUGAL PUMPS"),
            ("Shipped Quantity", "800 PCS / 64 WOODEN CRATES"),
            ("On-board Date", "17 AUG 2026"),
        ],
        "notes": [
            "Freight prepaid. Clean on-board notation shown for competition demonstration.",
            "The carrier and document number are fictional.",
        ],
    },
    "certificate_of_origin_demo.pdf": {
        "code": "INDEPENDENT EVIDENCE / SYNTHETIC",
        "title": "CERTIFICATE OF ORIGIN",
        "subtitle": "Issued for competition demonstration",
        "number": "CO-DE-2026-88317",
        "rows": [
            ("Exporter", "NORDWERK PUMPS GMBH"),
            ("Consignee", "WUHAN HUAYUAN ELECTROMECHANICAL EQUIPMENT CO., LTD."),
            ("Country of Origin", "GERMANY"),
            ("Commodity", "NW-80 CENTRIFUGAL PUMPS"),
            ("Certified Quantity", "800 PCS"),
            ("Transport Reference", "OBLHAMSHA260817"),
            ("Issue Date", "19 AUG 2026"),
            ("Issuing Body", "HAMBURG CHAMBER OF COMMERCE (FICTIONAL DEMO)"),
        ],
        "notes": [
            "This is a synthetic certificate and is not issued by any real chamber of commerce.",
        ],
    },
}


def fit_text(c: canvas.Canvas, value: str, x: float, y: float, max_width: float, size: float = 9) -> None:
    current = size
    while current > 6 and c.stringWidth(value, "Helvetica-Bold", current) > max_width:
        current -= 0.5
    c.setFont("Helvetica-Bold", current)
    c.drawString(x, y, value)


def draw_document(path: Path, spec: dict) -> None:
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4
    margin = 18 * mm
    inner_x = margin + 7 * mm
    content_w = width - 2 * margin - 14 * mm

    c.setTitle(f"SYNTHETIC - {spec['title']}")
    c.setAuthor("Maozheng Trusted Trade Demo")
    c.setSubject("Synthetic competition demonstration document")

    c.setStrokeColor(GREEN)
    c.setLineWidth(1.1)
    c.rect(margin, margin, width - 2 * margin, height - 2 * margin)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.35)
    c.rect(margin + 3 * mm, margin + 3 * mm, width - 2 * margin - 6 * mm, height - 2 * margin - 6 * mm)

    c.setFillColor(GREEN)
    c.rect(margin + 3 * mm, height - margin - 39 * mm, width - 2 * margin - 6 * mm, 36 * mm, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(inner_x, height - margin - 16 * mm, spec["title"])
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#BCD0C7"))
    c.drawString(inner_x, height - margin - 23 * mm, spec["subtitle"])
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(colors.white)
    c.drawRightString(width - inner_x, height - margin - 16 * mm, spec["number"])
    c.setFont("Helvetica", 6.7)
    c.setFillColor(colors.HexColor("#BCD0C7"))
    c.drawRightString(width - inner_x, height - margin - 23 * mm, spec["code"])

    y = height - margin - 52 * mm
    row_h = 13 * mm
    label_w = 48 * mm
    for index, (label, value) in enumerate(spec["rows"]):
        fill = PALE if index % 2 == 0 else colors.HexColor("#F8FAF8")
        c.setFillColor(fill)
        c.setStrokeColor(LINE)
        c.rect(inner_x, y - row_h, label_w, row_h, fill=1, stroke=1)
        c.setFillColor(colors.white)
        c.rect(inner_x + label_w, y - row_h, content_w - label_w, row_h, fill=1, stroke=1)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7.6)
        c.drawString(inner_x + 4 * mm, y - 8 * mm, label.upper())
        c.setFillColor(INK)
        fit_text(c, value, inner_x + label_w + 4 * mm, y - 8 * mm, content_w - label_w - 8 * mm)
        y -= row_h

    y -= 12 * mm
    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(inner_x, y, "REVIEW NOTES")
    y -= 7 * mm
    for note in spec["notes"]:
        c.setFillColor(INK)
        c.setFont("Helvetica", 7.4)
        words = note.split()
        line = ""
        for word in words:
            candidate = f"{line} {word}".strip()
            if c.stringWidth(candidate, "Helvetica", 7.4) > content_w - 6 * mm:
                c.drawString(inner_x + 4 * mm, y, line)
                y -= 5 * mm
                line = word
            else:
                line = candidate
        if line:
            c.drawString(inner_x + 4 * mm, y, line)
            y -= 7 * mm

    c.setStrokeColor(RED)
    c.setLineWidth(1)
    c.circle(width - 47 * mm, 42 * mm, 17 * mm, fill=0, stroke=1)
    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width - 47 * mm, 44 * mm, "SYNTHETIC")
    c.drawCentredString(width - 47 * mm, 39 * mm, "DEMO ONLY")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.5)
    c.drawString(inner_x, 34 * mm, "Generated for the Maozheng competition PoC. All entities, numbers and identifiers are fictional.")
    c.drawString(inner_x, 29 * mm, "This document is not valid for banking, customs, transport, payment or legal purposes.")
    c.save()


def main() -> None:
    PUBLIC_OUTPUT.mkdir(parents=True, exist_ok=True)
    ARCHIVE_OUTPUT.mkdir(parents=True, exist_ok=True)
    for filename, spec in DOCUMENTS.items():
        public_path = PUBLIC_OUTPUT / filename
        draw_document(public_path, spec)
        copy2(public_path, ARCHIVE_OUTPUT / filename)


if __name__ == "__main__":
    main()
