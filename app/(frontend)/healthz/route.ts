import config from "@payload-config";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  if (process.env.CMS_ENABLED !== "true") {
    return Response.json({ ok: true, cms: "disabled" }, { headers });
  }

  try {
    const payload = await getPayload({ config });
    await payload.count({
      collection: "product-categories",
      overrideAccess: false,
    });
    return Response.json({ ok: true, cms: "ready" }, { headers });
  } catch {
    return Response.json(
      { ok: false, cms: "unavailable" },
      { status: 503, headers },
    );
  }
}
