import { APIError } from "payload";
import type {
  CollectionBeforeChangeHook,
  CollectionBeforeOperationHook,
  GlobalBeforeChangeHook,
} from "payload";
import { hasPermission } from "./access";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const wouldTouchPublishedDocument = (
  data: Record<string, unknown>,
  originalDoc: Record<string, unknown> | undefined,
) =>
  data._status === "published" ||
  (originalDoc?._status === "published" && data._status !== "draft");

export const guardCollectionPublish: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
}) => {
  if (
    req.user &&
    wouldTouchPublishedDocument(data, originalDoc) &&
    !hasPermission(req.user, "publishContent")
  ) {
    throw new APIError(
      "Only publishers can change published content. Save an explicit draft for review.",
      403,
      null,
      true,
    );
  }
  return data;
};

export const guardGlobalPublish: GlobalBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (
    req.user &&
    wouldTouchPublishedDocument(data, originalDoc) &&
    !hasPermission(req.user, "publishContent")
  ) {
    throw new APIError(
      "Only publishers can change published content. Save an explicit draft for review.",
      403,
      null,
      true,
    );
  }
  return data;
};

export const enforceUploadLimit: CollectionBeforeOperationHook = ({ operation, args }) => {
  if (operation !== "create" && operation !== "update" && operation !== "updateByID") {
    return;
  }

  const file = (args as { file?: unknown }).file;
  if (
    file &&
    typeof file === "object" &&
    "size" in file &&
    typeof file.size === "number" &&
    file.size > MAX_UPLOAD_BYTES
  ) {
    throw new APIError("Files may not exceed 25 MB.", 413, null, true);
  }
};
