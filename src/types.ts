/** Shape of the budget JSON file stored on disk. */
export interface BudgetData {
  /** Percentage remaining (0–100). */
  remaining_percentage: number;
  /** Total tokens allocated for the month. */
  total_tokens: number;
  /** Tokens consumed so far this month. */
  used_tokens: number;
  /** ISO date when the budget resets. */
  reset_date: string;
}
