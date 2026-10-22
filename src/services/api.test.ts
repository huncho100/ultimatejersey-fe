import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, ApiRequestError } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("API validation error messages", () => {
  it("formats backend field validation arrays as useful text", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      detail: [
        { loc: ["body", "price"], msg: "Input should be greater than 0" },
        { loc: ["body", "image"], msg: "Use a root-relative URL" },
      ],
    }), { status: 422 })));
    await expect(apiRequest("/products")).rejects.toThrow(
      "price: Input should be greater than 0; image: Use a root-relative URL"
    );
  });

  it("preserves authorization status and the backend's message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ detail: "Administrator access required." }), { status: 403 }
    )));
    const error = await apiRequest("/admin/overview").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({ status: 403, message: "Administrator access required." });
  });
});
