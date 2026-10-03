"use server";

import { toApiErrorDetails, ApiErrorDetails } from "@/lib/core/api-error";
import { addReel, getReelsData } from "@/lib/reel/reel.api";
import { CreateReelRequest, Reel } from "@/lib/reel/reel.types";

export type CreateReelActionResult =
  | { ok: true; reel: Reel }
  | { ok: false; error: ApiErrorDetails };

/**
 * Server Action that runs the authenticated create-reel call on the server
 * (keeping `getServerSession`-backed code out of the client bundle) and
 * refreshes the server-side reels cache so the following `router.refresh()`
 * picks up the new data.
 */
export async function createReelAction(
  payload: Omit<CreateReelRequest, "id">,
): Promise<CreateReelActionResult> {
  try {
    const reel = await addReel(payload);
    await getReelsData(true);
    return { ok: true, reel };
  } catch (err) {
    // Returned instead of thrown: server action errors are masked in production.
    return { ok: false, error: toApiErrorDetails(err) };
  }
}