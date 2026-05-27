import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { BudgetData } from "./types.js";

const DEFAULT_BUDGET_PATH = join(homedir(), "gittt", "budget.json");

/**
 * Read the current token budget from the local JSON file.
 * If the file doesn't exist, a default budget (100 %) is created on disk.
 */
export function readBudget(budgetPath?: string): BudgetData {
  const path = budgetPath ?? DEFAULT_BUDGET_PATH;

  if (!existsSync(path)) {
    const defaultBudget: BudgetData = {
      remaining_percentage: 100,
      total_tokens: 1_000_000,
      used_tokens: 0,
      reset_date: new Date(
        Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 1),
      ).toISOString(),
    };
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(defaultBudget, null, 2)}\n`, "utf-8");
    return defaultBudget;
  }

  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as BudgetData;
}
