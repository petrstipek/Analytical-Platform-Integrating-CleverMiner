---
sidebar_position: 5
---

# UIC-Miner Results

The **UIC-Miner** (Uplift in Categories Miner) is designed to find conditions under which rare categories in a target attribute are proportionally boosted. It is especially valuable for imbalanced datasets where a minority category — such as a rare outcome or a high-value event — is difficult to isolate with standard association rule mining.

![UIC-Miner results page](/img/runs/runs_uic_miner.png)

## Run Summary

At the top of the page, three execution statistics are shown:

| Field | Description |
|---|---|
| **Status** | Whether the run completed successfully |
| **Rules Found** | Total number of rules discovered |
| **Execution Time** | How long the mining process took |

The **Run Configuration Details** section is collapsible and shows the full task configuration used for this run.

## Discovered Rules

The left panel lists all discovered rules in a scrollable table. Each rule is displayed as a colour-coded antecedent expression pointing to the target attribute, with a `*` symbol indicating the uplift target category. Click any rule to load its detail in the right panel.

## Rule Detail

Selecting a rule updates the **Rule Detail** panel on the right with the following components:

### Target Summary
Shows the **target attribute** and the full list of **categories** within it (e.g. Fatal, Serious, Slight).

### Histogram (Rule)
A histogram showing the distribution of the target attribute's categories among records that **match the rule's antecedent**. This lets you see how the category distribution shifts within the subgroup defined by the rule.

### Histogram (Background)
A histogram showing the distribution of the target attribute across the **entire dataset**. Comparing this with the Rule histogram makes it immediately visible how much the antecedent boosts the rare category relative to the baseline.

For example, if Fatal accidents make up 1.9% of the full dataset but 9.7% within the matched subgroup, the rule has identified a strong uplift condition for that rare category.

## Exporting Results

Use the **Export data** button in the top right to download the full result set. The **Show Raw Output** button displays the raw JSON response from the CleverMiner engine.