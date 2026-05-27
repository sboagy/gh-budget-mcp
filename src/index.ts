#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { readBudget } from "./budget.js";

// 1. Initialise the MCP server
const server = new Server(
  {
    name: "gh-budget-mcp",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  },
);

// 2. Register the tool schema so GitHub Copilot knows what is available
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_token_budget",
      description: "Returns the user's remaining token budget for the month as a percentage.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
}));

// 3. Execute the tool when the triage agent calls it
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_token_budget") {
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
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// 4. Start the server on stdio
const transport = new StdioServerTransport();
await server.connect(transport);
