---
sidebar_position: 4
---

# CF-Miner Results

The **CF-Miner** (Category Fishery Miner) discovers rules that describe how the distribution of a target categorical attribute shifts under specific antecedent conditions. It is particularly useful for finding circumstances that boost or suppress the occurrence of a particular category within a target attribute.

![CF-Miner results page](/img/runs/runs_cf_miner.png)

## Run Summary

At the top of the page, three execution statistics are shown:

| Field | Description |
|---|---|
| **Status** | Whether the run completed successfully |
| **Rules Found** | Total number of rules discovered |
| **Execution Time** | How long the mining process took |

The **Run Configuration Details** section is collapsible and shows the full task configuration used for this run.

## Discovered Rules

The left panel lists all discovered rules in a scrollable table. Each rule is displayed as a colour-coded antecedent expression pointing to the target attribute. Click any rule to load its detail in the right panel.

## Rule Detail

Selecting a rule updates the **Rule Detail** panel on the right with the following components:

### Target Summary
Shows the **target attribute** and the **categories** being analysed within it (e.g. Fatal, Serious, Slight for a Severity attribute).

### Histogram (Rule)
A histogram showing the distribution of the target attribute's categories among records that match the rule's antecedent. This gives you the category breakdown specifically within the subgroup defined by the rule.

Each category bar shows its relative percentage and absolute count, making it straightforward to see which categories are over- or under-represented in the matched subgroup.

### Statistical Indicators

| Indicator | Description |
|---|---|
| **Base** | Number of records matching the antecedent |
| **Relative Base** | The antecedent's share of the total dataset |
| **Min / Max** | Minimum and maximum category counts within the rule |
| **Rel Min / Rel Max** | Relative (percentage) equivalents of min and max |

## Exporting Results

Use the **Export data** button in the top right to download the full result set. The **Show Raw Output** button displays the raw JSON response from the CleverMiner engine.