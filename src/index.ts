#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readBudget } from "./budget.js";

// 1. Initialise the MCP server
const server = new McpServer(
  {
    name: "gh-budget-mcp",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  },
);

// 2. Register the tool — handles both discovery and execution
server.registerTool(
  "get_token_budget",
  {
    description: "Returns the user's remaining token budget for the month as a percentage.",
  },
  async () => {
    const budget = readBudget();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              remainingPercentage: budget.remaining_percentage,
              totalTokens: budget.total_tokens,
              usedTokens: budget.used_tokens,
              resetDate: budget.reset_date,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// 3. Start the server on stdio
const transport = new StdioServerTransport();
await server.connect(transport);
