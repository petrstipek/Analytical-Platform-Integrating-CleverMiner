---
sidebar_position: 4
---

# CleverMiner Guidance

The **CleverMiner Guidance** tab is a heuristic analysis tool that evaluates your dataset's columns and classifies them based on their readiness for use with CleverMiner. Rather than requiring you to manually assess every column, this tab does the initial analysis for you and tells you exactly what needs attention.

![CleverMiner Guidance tab](/img/datasets/dataset_clm_guidance.png)

## Column Classifications

Columns are divided into three groups displayed side by side:

### ✅ Ready
Columns that are already suitable for use directly with CleverMiner without any further preprocessing. These are typically categorical columns or numeric columns with a low number of unique values that can be treated as ordinal categories.

### ⚠️ Needs Binning
Columns that are continuous numeric and require discretisation before they can be used in a mining task. CleverMiner works with categorical data, so continuous values must be converted into bins first.

### ✖️ Ignored
Columns that are advised to be excluded from mining tasks entirely. This typically includes columns with very high cardinality (many unique values) that would not produce meaningful rules, such as free-text fields, IDs, or codes. The reason for ignoring each column is shown inline.

## How to Use It

Use this tab as a **preparation checklist** before creating a mining task:

1. Review the **Needs Binning** columns and apply discretisation via the [Columns Analysis and Preprocessing](./dataset_preprocessing_guide) tab
2. Consider dropping or ignoring the **Ignored** columns
3. Once all relevant columns are in the **Ready** group, your dataset is ready for use in a task

:::info
The classifications shown here are heuristic suggestions based on the data structure. You are free to override them.