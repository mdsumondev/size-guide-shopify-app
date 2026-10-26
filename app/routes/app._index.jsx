import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

// 1. MUST be "export default" for Remix to render the page
export default function HomePage() {


  const [expanded, setExpanded] = useState({
    guide: true,
    step1: true,
    step2: false,
    step3: false,
  });

  const [completed, setCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
  });

  const completedCount = Object.values(completed).filter(Boolean).length;



  return (
    <s-page heading="Puzzles">
      <s-button slot="primary-action" variant="primary" href="/app/addsize">
        Create Size Guide
      </s-button>
   

      {/* Empty state */}

  

  {/* ---------------- setup guide instructions ----------------- */}


<s-section>
      <s-grid gap="base">
        <s-grid gap="small-200">
          <s-grid
            gridTemplateColumns="1fr auto auto"
            gap="small-300"
            alignItems="center"
          >
            <s-heading>Setup Guide</s-heading>
            <s-button
              accessibilityLabel="Dismiss Guide"
              variant="tertiary"
              tone="neutral"
              icon="x"
            />
            <s-button
              accessibilityLabel="Toggle setup guide"
              variant="tertiary"
              tone="neutral"
              onClick={() =>
                setExpanded({ ...expanded, guide: !expanded.guide })
              }
              icon={expanded.guide ? "chevron-up" : "chevron-down"}
            />
          </s-grid>
          <s-paragraph>
            Use this quick setup guide to activate your size charts and help
            customers find their perfect fit.
          </s-paragraph>
          <s-paragraph color="subdued">
            {completedCount} out of 3 steps completed
          </s-paragraph>
        </s-grid>

        <s-box
          borderRadius="base"
          border="base"
          background="base"
          display={expanded.guide ? "auto" : "none"}
        >
          {/* === STEP 1: Enable App Embed === */}
          <s-box>
            <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
              <s-checkbox
                label="Enable App Embed on your theme"
                checked={completed.step1}
                onChange={() =>
                  setCompleted({ ...completed, step1: !completed.step1 })
                }
              />
              <s-button
                accessibilityLabel="Toggle step 1 details"
                variant="tertiary"
                onClick={() =>
                  setExpanded({ ...expanded, step1: !expanded.step1 })
                }
                icon={expanded.step1 ? "chevron-up" : "chevron-down"}
              />
            </s-grid>
            <s-box
              padding="small"
              paddingBlockStart="none"
              display={expanded.step1 ? "auto" : "none"}
            >
              <s-box padding="base" background="subdued" borderRadius="base">
                <s-grid
                  gridTemplateColumns="1fr auto"
                  gap="base"
                  alignItems="center"
                >
                  <s-grid gap="small-200">
                    <s-paragraph>
                      Activate the Size Guide app embed in your Shopify Theme
                      Editor so the size chart button can automatically appear
                      on your product pages. Don't forget to click
                      <strong>Save</strong> in the top right corner.
                    </s-paragraph>
                    <s-stack direction="inline" gap="small-200">
                      <s-button
                        variant="primary"
                        onClick={() => {
                          setCompleted({ ...completed, step1: true });
                          setExpanded({
                            ...expanded,
                            step1: false,
                            step2: true,
                          });
                        }}
                      >
                        Enable App Embed
                      </s-button>
                  
                    </s-stack>
                  </s-grid>
                  <s-box maxBlockSize="80px" maxInlineSize="80px">
                    <s-image
                      src="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                      alt="Enable app embed illustration"
                    />
                  </s-box>
                </s-grid>
              </s-box>
            </s-box>
          </s-box>

          <s-divider />

          {/* === STEP 2: Create & Assign First Size Chart === */}
          <s-box>
            <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
              <s-checkbox
                label="Create and assign your first size chart"
                checked={completed.step2}
                onChange={() =>
                  setCompleted({ ...completed, step2: !completed.step2 })
                }
              />
              <s-button
                accessibilityLabel="Toggle step 2 details"
                variant="tertiary"
                onClick={() =>
                  setExpanded({ ...expanded, step2: !expanded.step2 })
                }
                icon={expanded.step2 ? "chevron-up" : "chevron-down"}
              />
            </s-grid>
            <s-box
              padding="small"
              paddingBlockStart="none"
              display={expanded.step2 ? "auto" : "none"}
            >
              <s-box padding="base" background="subdued" borderRadius="base">
                <s-grid
                  gridTemplateColumns="1fr auto"
                  gap="base"
                  alignItems="center"
                >
                  <s-grid gap="small-200">
                    <s-paragraph>
                      Build a size chart from scratch or start with a preset
                      template (T-shirts, Jeans, Shoes, etc.), then assign it to
                      specific products, collections, or product tags.
                    </s-paragraph>
                    <s-stack direction="inline" gap="small-200">
                      <s-button
                        variant="primary"
                        href="/app/addsize"
                        onClick={() => {
                          setCompleted({ ...completed, step2: true });
                          setExpanded({
                            ...expanded,
                            step2: false,
                            step3: true,
                          });
                        }}
                      >
                        Create size chart
                      </s-button>
                      <s-button variant="tertiary" tone="neutral">
                        Browse templates
                      </s-button>
                    </s-stack>
                  </s-grid>
                  <s-box maxBlockSize="80px" maxInlineSize="80px">
                    <s-image
                      src="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                      alt="Create size chart illustration"
                    />
                  </s-box>
                </s-grid>
              </s-box>
            </s-box>
          </s-box>

          <s-divider />

          {/* === STEP 3: Customize Button & Popup Design === */}
          <s-box>
            <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
              <s-checkbox
                label="Customize button & popup appearance"
                checked={completed.step3}
                onChange={() =>
                  setCompleted({ ...completed, step3: !completed.step3 })
                }
              />
              <s-button
                accessibilityLabel="Toggle step 3 details"
                variant="tertiary"
                onClick={() =>
                  setExpanded({ ...expanded, step3: !expanded.step3 })
                }
                icon={expanded.step3 ? "chevron-up" : "chevron-down"}
              />
            </s-grid>
            <s-box
              padding="small"
              paddingBlockStart="none"
              display={expanded.step3 ? "auto" : "none"}
            >
              <s-box padding="base" background="subdued" borderRadius="base">
                <s-grid
                  gridTemplateColumns="1fr auto"
                  gap="base"
                  alignItems="center"
                >
                  <s-grid gap="small-200">
                    <s-paragraph>
                      Match the Size Guide trigger button, ruler icon, colors,
                      and unit switcher (IN/CM) with your store's branding.
                    </s-paragraph>
                    <s-stack direction="inline" gap="small-200">
                      <s-button
                        variant="primary"
                        onClick={() =>
                          setCompleted({ ...completed, step3: true })
                        }
                      >
                        Customize style
                      </s-button>
                    </s-stack>
                  </s-grid>
                  <s-box maxBlockSize="80px" maxInlineSize="80px">
                    <s-image
                      src="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                      alt="Customize appearance illustration"
                    />
                  </s-box>
                </s-grid>
              </s-box>
            </s-box>
          </s-box>
        </s-box>
      </s-grid>
    </s-section>


  {/* ---------------- setup guide instructions ----------------- */}


      <s-section accessibilityLabel="Empty state section">
        <s-empty-state heading="Start creating puzzles">
          <s-box slot="graphic" maxInlineSize="200px">
            <s-image
              aspectRatio="1/0.5"
              src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
              alt="A stylized graphic of four characters, each holding a puzzle piece"
            />
          </s-box>
          <s-text slot="subheading">
            Create and manage your collection of puzzles for players to enjoy.
          </s-text>
 
          <s-button slot="primary-action" variant="primary" href="/app/addsize">
            Create Size Guide
          </s-button>
        </s-empty-state>
      </s-section>

      {/* Table section */}
      <s-section padding="none" accessibilityLabel="Puzzles table section">
        <s-table>
          <s-table-header-row>
            <s-table-header listSlot="primary">Puzzle</s-table-header>
            <s-table-header format="numeric">Pieces</s-table-header>
            <s-table-header>Created</s-table-header>
            <s-table-header>Status</s-table-header>
          </s-table-header-row>
          <s-table-body>
            <s-table-row>
              <s-table-cell>
                <s-stack direction="inline" gap="small" alignItems="center">
                  <s-clickable
                    href="#"
                    accessibilityLabel="Mountain View puzzle thumbnail"
                    border="base"
                    borderRadius="base"
                    overflow="hidden"
                    inlineSize="40px"
                    blockSize="40px"
                  />
                  <s-link href="#">Mountain View</s-link>
                </s-stack>
              </s-table-cell>
              <s-table-cell>16</s-table-cell>
              <s-table-cell>Today</s-table-cell>
              <s-table-cell>
                <s-badge color="base" tone="success">
                  Active
                </s-badge>
              </s-table-cell>
            </s-table-row>
          </s-table-body>
        </s-table>
      </s-section>

      {/* Footer help */}
      <s-stack alignItems="center" paddingBlock="large">
        <s-text color="subdued">
          Learn more about{" "}
          <s-link href="https://help.shopify.com" target="_blank">
            improving product quality
          </s-link>
          .
        </s-text>
      </s-stack>
    </s-page>
  );
}