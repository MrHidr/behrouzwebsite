import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from "payload";

type Row = Record<string, unknown>;

function preserveRows(
  incoming: unknown,
  previous: unknown,
  identityField: "sourceKey" | "sourcePath",
) {
  if (!Array.isArray(previous)) return incoming;
  const incomingRows = Array.isArray(incoming) ? incoming as Row[] : [];
  const byIdentity = new Map(
    incomingRows.map((row) => [String(row[identityField] || ""), row]),
  );
  return (previous as Row[]).map((previousRow) => {
    const identity = String(previousRow[identityField] || "");
    const next = byIdentity.get(identity) || previousRow;
    return {
      ...next,
      id: previousRow.id,
      [identityField]: previousRow[identityField],
      adminLabel: previousRow.adminLabel,
    };
  });
}

function preserveSections(incoming: unknown, previous: unknown) {
  if (!Array.isArray(previous)) return incoming;
  const incomingRows = Array.isArray(incoming) ? incoming as Row[] : [];
  const byKey = new Map(
    incomingRows.map((row) => [String(row.sectionKey || ""), row]),
  );

  return (previous as Row[]).map((previousSection) => {
    const sectionKey = String(previousSection.sectionKey || "");
    const next = byKey.get(sectionKey) || previousSection;
    return {
      ...next,
      id: previousSection.id,
      sectionKey: previousSection.sectionKey,
      adminLabel: previousSection.adminLabel,
      locked: previousSection.locked,
      enabled: previousSection.locked ? true : next.enabled !== false,
      copyBlocks: preserveRows(next.copyBlocks, previousSection.copyBlocks, "sourceKey"),
      imageOverrides: preserveRows(next.imageOverrides, previousSection.imageOverrides, "sourcePath"),
      valueOverrides: preserveRows(next.valueOverrides, previousSection.valueOverrides, "sourceKey"),
      lists: preserveLists(next.lists, previousSection.lists),
    };
  });
}

function preserveLists(incoming: unknown, previous: unknown) {
  if (!Array.isArray(previous)) return incoming;
  const incomingRows = Array.isArray(incoming) ? incoming as Row[] : [];
  const byKey = new Map(incomingRows.map((row) => [String(row.listKey || ""), row]));
  return (previous as Row[]).map((previousList) => {
    const next = byKey.get(String(previousList.listKey || "")) || previousList;
    return {
      ...next,
      id: previousList.id,
      listKey: previousList.listKey,
      adminLabel: previousList.adminLabel,
      items: Array.isArray(next.items) ? next.items : previousList.items,
    };
  });
}

export const preserveManagedPageStructure: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (
    operation !== "update" ||
    !originalDoc ||
    req.context?.syncManagedPageStructure
  ) {
    return data;
  }

  data.sections = preserveSections(data.sections, originalDoc.sections);
  data.copyBlocks = preserveRows(data.copyBlocks, originalDoc.copyBlocks, "sourceKey");
  data.imageOverrides = preserveRows(
    data.imageOverrides,
    originalDoc.imageOverrides,
    "sourcePath",
  );
  data.valueOverrides = preserveRows(
    data.valueOverrides,
    originalDoc.valueOverrides,
    "sourceKey",
  );
  return data;
};

export const preserveManagedInterfaceStructure: GlobalBeforeChangeHook = ({
  data,
  originalDoc,
  req,
}) => {
  if (!originalDoc || req.context?.syncManagedPageStructure) return data;
  data.interfaceCopy = preserveRows(
    data.interfaceCopy,
    originalDoc.interfaceCopy,
    "sourceKey",
  );
  return data;
};
