import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Certificate } from "@/lib/types";

const NAVY = rgb(0.07, 0.24, 0.45);
const GOLD = rgb(0.79, 0.64, 0.15);
const INK = rgb(0.15, 0.17, 0.2);
const MUTED = rgb(0.45, 0.47, 0.52);

const typeLabel: Record<Certificate["type"], string> = {
  baptism: "Certificate of Baptism",
  membership: "Certificate of Membership",
  marriage: "Certificate of Marriage",
  dedication: "Certificate of Dedication",
  confirmation: "Certificate of Confirmation",
};

export async function generateCertificatePdf(cert: {
  type: Certificate["type"];
  recipient: string;
  dateIssued: string;
  issuedBy?: string;
  logoUrl?: string | null;
}): Promise<Blob> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([792, 612]); // US Letter, landscape

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const sans = await doc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const cx = width / 2;

  const centerText = (text: string, y: number, font: typeof serif, size: number, color = INK) => {
    page.drawText(text, { x: cx - font.widthOfTextAtSize(text, size) / 2, y, font, size, color });
  };

  // Outer navy frame
  page.drawRectangle({ x: 36, y: 36, width: width - 72, height: height - 72, borderColor: NAVY, borderWidth: 3 });
  // Inner gold frame
  page.drawRectangle({ x: 52, y: 52, width: width - 104, height: height - 104, borderColor: GOLD, borderWidth: 1.2 });

  // Church logo (uploaded via Settings → General)
  if (cert.logoUrl) {
    const image = cert.logoUrl.startsWith("data:image/png")
      ? await doc.embedPng(cert.logoUrl).catch(() => null)
      : cert.logoUrl.startsWith("data:image/jpeg") || cert.logoUrl.startsWith("data:image/jpg")
        ? await doc.embedJpg(cert.logoUrl).catch(() => null)
        : null;
    if (image) {
      page.drawImage(image, { x: cx - 22, y: height - 136, width: 44, height: 44 });
    }
  }

  // Church name
  centerText("AFM LIGHTHOUSE CHURCH", height - 176, serifBold, 26, NAVY);
  centerText("Vryburg", height - 202, serif, 14, MUTED);

  // Gold divider
  page.drawLine({ start: { x: cx - 160, y: height - 222 }, end: { x: cx + 160, y: height - 222 }, thickness: 1.5, color: GOLD });

  // Certificate type
  centerText(typeLabel[cert.type], height - 252, serifBold, 20, GOLD);

  // Intro
  centerText("This certifies that", height - 292, serif, 15, MUTED);

  // Recipient name
  centerText(cert.recipient.toUpperCase(), height - 340, serifBold, 34, NAVY);

  // Gold divider under name
  page.drawLine({ start: { x: cx - 140, y: height - 358 }, end: { x: cx + 140, y: height - 358 }, thickness: 1.5, color: GOLD });

  // Body
  centerText(
    "has been received into the fellowship of AFM Lighthouse Church Vryburg,",
    height - 392,
    serif,
    14
  );
  centerText(
    "through the grace of our Lord Jesus Christ, and is commended to the",
    height - 416,
    serif,
    14
  );
  centerText("prayers and care of the congregation.", height - 440, serif, 14);

  // Date
  const formattedDate = new Date(`${cert.dateIssued}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  centerText(`Issued on ${formattedDate}`, height - 486, serifItalic, 13, MUTED);

  // Signature line
  page.drawLine({
    start: { x: cx - 150, y: 110 },
    end: { x: cx - 10, y: 110 },
    thickness: 1,
    color: MUTED,
  });
  const signatory = cert.issuedBy ? cert.issuedBy.split("@")[0] : "Pastor";
  centerText(signatory.toUpperCase(), 96, sansBold, 9, INK);
  centerText("Signed by", 82, sans, 8, MUTED);

  // Serial number
  const serial = `Certificate No. ${cert.type.toUpperCase().slice(0, 3)}-${Math.abs((cert.recipient.length * 7919) % 1000000)
    .toString()
    .padStart(6, "0")}`;
  page.drawText(serial, {
    x: width - 70 - sans.widthOfTextAtSize(serial, 7),
    y: 46,
    font: sans,
    size: 7,
    color: MUTED,
  });

  const bytes = await doc.save();
  return new Blob([bytes], { type: "application/pdf" });
}
