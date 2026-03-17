---
sidebar_position: 3
---

# SD4ft-Miner Results

The **SD4ft-Miner** is the subgroup discovery variant of the 4ft-Miner. It mines *couples* of rules — comparing how the same pattern behaves across two different subgroups of the data. This makes it particularly useful for identifying whether a relationship holds differently for distinct segments.

![SD4ft-Miner results page](/img/runs/runs_sd4ft_miner.png)

## Run Summary

At the top of the page, three execution statistics are shown:

| Field | Description |
|---|---|
| **Status** | Whether the run completed successfully |
| **Rules Found** | Total number of rule couples discovered |
| **Execution Time** | How long the mining process took |

The **Run Configuration Details** section is collapsible and shows the full task configuration used for this run.

## Discovered Rules

The left panel lists all discovered rule couples in a scrollable table. Each rule is displayed as a colour-coded logical expression using a colour scheme distinct from the 4ft-Miner, reflecting the different nature of the results. The table columns include:

- **Rule Logic** — the antecedent and succedent of the rule couple
- **Confidence** — the conditional probability for the rule, colour-coded by strength
- **Base** — the number of records matching the antecedent

Click any rule to load its detail in the right panel.

## Rule Detail

Selecting a rule updates the **Rule Detail** panel with two fourfold tables — one for each of the two subgroups being compared.

### Fourfold Table (Group 1) and Fourfold Table (Group 2)

Each table is a contingency table breaking down the subgroup's records into four cells:

|  | Succedent | No Succedent |
|---|---|---|
| **Antecedent** | Matched (a) | Mismatch (b) |
| **No Antecedent** | Mismatch (c) | Rest (d) |

Comparing the two tables side by side reveals how the strength or direction of the rule differs between the two subgroups, which is the core analytical value of the SD4ft-Miner.

## Exporting Results

Use the **Export data** button in the top right to download the full result set. The **Show Raw Output** button displays the raw JSON response from the CleverMiner engine.