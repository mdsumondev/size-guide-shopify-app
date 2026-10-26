import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  const form = await request.formData();
  const name = form.get("name");
  const rows = JSON.parse(form.get("rows") || "[]");

  // TODO: Persist the size guide (name + rows) to the database.
  return { ok: true, name, rows };
};

const EMPTY_ROWS = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export default function AddSizePage() {
  const shopify = useAppBridge();
  const fetcher = useFetcher();
  const saving = fetcher.state !== "idle";

  const [name, setName] = useState("");
  const [rows, setRows] = useState(EMPTY_ROWS);
  const [columns, setColumns] = useState(["Size", "Chest", "Waist"]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      shopify.toast.show("Size guide created successfully");
    }
  }, [fetcher.state, fetcher.data, shopify]);

  const setCell = (rowIndex, colIndex, value) => {
    setRows((prev) =>
      prev.map((row, r) =>
        r === rowIndex ? row.map((cell, c) => (c === colIndex ? value : cell)) : row,
      ),
    );
  };

  const addRow = () => setRows((prev) => [...prev, columns.map(() => "")]);
  const removeRow = (rowIndex) =>
    setRows((prev) => prev.filter((_, r) => r !== rowIndex));

  const addColumn = () => {
    setColumns((prev) => [...prev, `Column ${prev.length + 1}`]);
    setRows((prev) => prev.map((row) => [...row, ""]));
  };

  const selectProducts = async () => {
    try {
      const selection = await shopify.resourcePicker({
        type: "product",
        multiple: true,
      });
      if (selection) {
        setProducts(
          selection.map((product) => ({ id: product.id, title: product.title })),
        );
      }
    } catch {
      // Picker was cancelled by the user.
    }
  };

  const submit = () => {
    fetcher.submit(
      { name, rows: JSON.stringify(rows), products: JSON.stringify(products) },
      { method: "post" },
    );
  };

  return (
    <s-page heading="Create Size Guide">
      {/* Header: close (cross) icon */}
      <s-button
        slot="secondary-actions"
        variant="tertiary"
        tone="neutral"
        icon="x"
        href="/app"
        accessibilityLabel="Close"
      />

      {/* Size guide name */}
      <s-section>
        <s-text-field
          label="Size guide name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value ?? e.detail?.value ?? "")}
          placeholder="e.g. Men's T-Shirts"
        />
      </s-section>

      {/* Dynamic size table */}
      <s-section>
        <s-table accessibilityLabel="Size chart">
          <s-table-header-row>
            {columns.map((col, c) => (
              <s-table-header key={c} listSlot={c === 0 ? "primary" : undefined}>
                <s-text-field
                  value={col}
                  label={c === 0 ? undefined : ""}
                  hideLabel
                  onChange={(e) => {
                    const value = e.target.value ?? e.detail?.value ?? "";
                    setColumns((prev) => prev.map((v, i) => (i === c ? value : v)));
                  }}
                />
              </s-table-header>
            ))}
            <s-table-header></s-table-header>
          </s-table-header-row>
          <s-table-body>
            {rows.map((row, r) => (
              <s-table-row key={r}>
                {row.map((cell, c) => (
                  <s-table-cell key={c}>
                    <s-text-field
                      value={cell}
                      label=""
                      hideLabel
                      onChange={(e) => setCell(r, c, e.target.value ?? e.detail?.value ?? "")}
                    />
                  </s-table-cell>
                ))}
                <s-table-cell>
                  <s-button
                    variant="tertiary"
                    tone="neutral"
                    icon="x"
                    accessibilityLabel={`Remove row ${r + 1}`}
                    onClick={() => removeRow(r)}
                  />
                </s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>

        <s-stack direction="inline" gap="base" paddingBlockStart="base">
          <s-button variant="primary" onClick={addRow}>
            Add row
          </s-button>
          <s-button onClick={addColumn}>Add column</s-button>
          <s-button variant="tertiary" tone="neutral" onClick={selectProducts}>
            {products.length > 0
              ? `${products.length} product${products.length > 1 ? "s" : ""} selected`
              : "Select product"}
          </s-button>
        </s-stack>
      </s-section>

      {/* Footer section (save bar) */}
      <s-section>
        <s-box background="subdued" padding="base" borderRadius="base">
          <s-grid gridTemplateColumns="1fr auto auto" gap="base" alignItems="center">
            <s-text color="subdued">
              Save this size guide to attach it to your products.
            </s-text>
            {products.length > 0 ? (
              <s-text>{products.map((p) => p.title).join(", ")}</s-text>
            ) : null}
            <s-stack direction="inline" gap="small-200">
              <s-button href="/app" accessibilityLabel="Cancel">
                Cancel
              </s-button>
              <s-button variant="primary" loading={saving} onClick={submit}>
                Save
              </s-button>
            </s-stack>
          </s-grid>
        </s-box>
      </s-section>
    </s-page>
  );
}
