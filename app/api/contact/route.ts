import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.CONTACT_TO_EMAIL || "zaydthirteen@gmail.com";
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;

function escapeHtml(input: string) {
  return input.replace(
    /[&<>"']/g,
    (c) =>
      (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        } as Record<string, string>
      )[c],
  );
}

export async function POST(req: Request) {
  let payload: { name?: string; email?: string; message?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = (payload.name ?? "").toString().trim().slice(0, 120);
  const email = (payload.email ?? "").toString().trim().slice(0, 160);
  const message = (payload.message ?? "").toString().trim().slice(0, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "All fields are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // If Gmail credentials aren't configured, instruct the client to fall back
  // to a mailto: link so visitors can still reach out.
  if (!GMAIL_USER || !GMAIL_PASS) {
    return NextResponse.json(
      { ok: false, fallback: "mailto", to: TO },
      { status: 200 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });

    await transporter.sendMail({
      from: `Portfolio Contact <${GMAIL_USER}>`,
      to: TO,
      replyTo: `${name} <${email}>`,
      subject: `New portfolio enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0a0a0a">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route mail error:", err);
    return NextResponse.json(
      { ok: false, fallback: "mailto", to: TO, error: "Could not send email." },
      { status: 200 },
    );
  }
}