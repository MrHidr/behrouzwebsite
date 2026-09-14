import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

const ignoredFields = new Set(["createdAt", "updatedAt", "sizes", "password", "salt", "hash"]);

type RecordLike = Record<string, unknown>;

function userDetails(req: PayloadRequest) {
  if (!req.user || typeof req.user !== "object") return null;
  const user = req.user as { id?: number | string; email?: string };
  if (!user.id || !user.email) return null;
  const id = typeof user.id === "number" ? user.id : Number(user.id);
  if (!Number.isFinite(id)) return null;
  return { id, email: user.email };
}

function changedFields(doc: RecordLike, previous?: RecordLike) {
  if (!previous) return Object.keys(doc).filter((key) => !ignoredFields.has(key));
  return Object.keys(doc).filter((key) => {
    if (ignoredFields.has(key)) return false;
    return JSON.stringify(doc[key]) !== JSON.stringify(previous[key]);
  });
}

function documentTitle(doc: RecordLike, fallback: string) {
  for (const key of ["name", "title", "label", "email", "slug", "stableKey", "filename"]) {
    const value = doc[key];
    if (typeof value === "string" && value.trim()) return value.slice(0, 180);
  }
  return fallback;
}

async function writeLog(args: {
  req: PayloadRequest;
  action: "create" | "update" | "delete" | "update-global";
  entityLabel: string;
  entitySlug: string;
  doc: RecordLike;
  previous?: RecordLike;
  documentID?: number | string;
}) {
  const actor = userDetails(args.req);
  if (!actor || args.req.context?.skipActivityLog) return;

  const fields = changedFields(args.doc, args.previous);
  await args.req.payload.create({
    collection: "activity-logs",
    overrideAccess: true,
    context: { skipActivityLog: true },
    data: {
      actor: actor.id,
      actorEmail: actor.email,
      action: args.action,
      entityLabel: args.entityLabel,
      entitySlug: args.entitySlug,
      documentID: args.documentID === undefined ? undefined : String(args.documentID),
      documentTitle: documentTitle(args.doc, args.entityLabel),
      changedFields: fields.map((field) => ({ field })),
      locale: typeof args.req.locale === "string" ? args.req.locale : undefined,
    },
  });
}

export const logCollectionChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  await writeLog({
    req,
    action: operation,
    entityLabel: typeof collection.labels.plural === "string" ? collection.labels.plural : collection.slug,
    entitySlug: collection.slug,
    doc: doc as RecordLike,
    previous: previousDoc as RecordLike | undefined,
    documentID: (doc as RecordLike).id as number | string | undefined,
  });
  return doc;
};

export const logCollectionDelete: CollectionAfterDeleteHook = async ({ collection, doc, id, req }) => {
  await writeLog({
    req,
    action: "delete",
    entityLabel: typeof collection.labels.plural === "string" ? collection.labels.plural : collection.slug,
    entitySlug: collection.slug,
    doc: doc as RecordLike,
    documentID: id,
  });
  return doc;
};

export const logGlobalChange: GlobalAfterChangeHook = async ({ doc, global, previousDoc, req }) => {
  await writeLog({
    req,
    action: "update-global",
    entityLabel: typeof global.label === "string" ? global.label : global.slug,
    entitySlug: global.slug,
    doc: doc as RecordLike,
    previous: previousDoc as RecordLike | undefined,
    documentID: global.slug,
  });
  return doc;
};
