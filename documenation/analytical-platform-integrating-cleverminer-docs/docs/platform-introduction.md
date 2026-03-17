---
sidebar_label: 'Platform Introduction'
sidebar_position: 1
---

# Introduction

**Analytical Platform Integrating CleverMiner** is a web application wrapper around [CleverMiner](https://www.cleverminer.org/), a powerful engine for **rules-based data mining**. The platform provides a modern, user-friendly interface that makes it easy to upload datasets, run analytical tasks, and explore discovered association rules without touching the command line or Python code.

## What is it?

CleverMiner is a data mining tool focused on finding patterns and rules in structured data. This platform wraps it in a full-stack web application, making it accessible to analysts and data scientists through a browser-based UI.

## GUHA Procedures
 
The platform is built around the **GUHA method** (General Unary Hypotheses Automaton), a formal framework for automated hypothesis formation and data mining that generalizes standard association rules far beyond what classic apriori-based methods offer. Rather than searching for frequent itemsets, GUHA procedures work with categorical data and express richer, statistically grounded patterns of the form *"If A then B with probability p"*.
 
The platform exposes all four GUHA procedures implemented in CleverMiner:
 
| Procedure | Purpose |
|---|---|
| **4ft-Miner** | The core procedure for mining enhanced association rules. Finds rules of the form `A => B` with a wide range of statistical quantifiers (confidence, support, lift, and more). |
| **SD4ft-Miner** | Subgroup discovery variant of 4ft-Miner. Mines *couples* of rules to compare how a pattern behaves across two different subgroups of the data. |
| **CF-Miner** | Category fishery — mines rules that describe how the distribution of a target categorical attribute shifts under specific conditions. Useful for finding circumstances that boost or suppress a particular category. |
| **UIC-Miner** | Uplift in categories — a newer procedure designed to find conditions under which rare categories are proportionally boosted, making it especially valuable for imbalanced datasets. |
 
Each procedure targets a different type of analytical question, giving you a versatile toolkit for exploratory data analysis within a single platform.

The platform is built with:

- **React** (TypeScript) frontend
- **Django** backend with a REST API
- **PostgreSQL** for persistent storage
- **Redis + Celery** for background task processing
- **Docker** for easy deployment

## Key Features

- 📂 **Dataset management** — upload and manage your data files
- ⚙️ **Task configuration** — configure and run CleverMiner analytical tasks
- 📊 **Results exploration** — browse and filter discovered rules and patterns
- 🐳 **Docker-based deployment** — get up and running with a single command

## How to Access

| Service        | URL                          |
|----------------|------------------------------|
| Frontend       | http://localhost:3000        |
| Backend API    | http://localhost:8000/api    |
| API Docs       | http://localhost:8000/api/docs |

## Quick Start

No source code needed — just Docker.

**1. Download the compose file:**

```bash
curl -O https://raw.githubusercontent.com/petrstipek/Analytical-Platform-Integrating-CleverMiner/main/docker-compose.hub.yml
```

**2. Start the application:**

```bash
docker compose -f docker-compose.hub.yml up -d
```

**3. Open [http://localhost:3000](http://localhost:3000), register and log in.**

:::tip Prerequisites
Make sure you have [Docker Desktop](https://docs.docker.com/get-docker/) installed and running before you start.
:::

## Next Steps

Once you're up and running, head over to the next sections to learn how to:

- Upload and manage your datasets
- Create and configure analytical tasks
- Explore and interpret your results