import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

const app = express();
app.set("trust proxy", 1);

app.use((req, res, next) => {
  if (
    req.path === "/mcp" ||
    req.path === "/health"
  ) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      [
        "Content-Type",
        "Mcp-Session-Id",
        "MCP-Protocol-Version"
      ].join(", ")
    );
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Mcp-Session-Id"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
  }

  next();
});

app.use(express.json({ limit: "1mb" }));

function jsonResult(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2)
      }
    ]
  };
}

function errorResult(error) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text:
          error?.message ||
          "Quest Board Guild operation failed."
      }
    ]
  };
}

const requestSchema = {
  request_id:
    z.string().uuid(),

  return_capability:
    z.string()
      .regex(/^[0-9a-f]{64}$/)
};

const readOnlyToolMetadata = {
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  }
};

const writeToolMetadata = {
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false
  }
};

function buildServer() {
  const server =
    new McpServer({
      name: "quest-board-guild",
      version: "0.1.0"
    });

  server.registerTool(
    "get_guild_request",
    {
      title: "Read Guild Request",
      description:
        "Read one capability-scoped Quest Board Guild request and its live game context. Use this first for every Quest Board handoff. The return capability only authorizes this single short-lived request and does not grant repository or arbitrary database access.",
      inputSchema: requestSchema,
      ...readOnlyToolMetadata
    },
    async ({
      request_id,
      return_capability
    }) => {
      try {
        const { data, error } =
          await supabase.rpc(
            "guild_get_request",
            {
              requested_request_id:
                request_id,
              supplied_capability:
                return_capability
            }
          );

        if (error) {
          throw error;
        }

        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "create_guild_artifact",
    {
      title: "Create Guild Artifact",
      description:
        "Save one generated Quest Board Guild artifact for the current capability-scoped request. Supported artifacts: personal_quest, boss_quest, party_challenge, story_beat, npc_dialogue. Quest rewards are validated and calculated by Quest Board on the server; do not claim arbitrary XP, gold, crystals, unlocks, or completed activity.",
      inputSchema: {
        ...requestSchema,

        artifact_type:
          z.enum([
            "personal_quest",
            "boss_quest",
            "party_challenge",
            "story_beat",
            "npc_dialogue"
          ]),

        payload:
          z.record(
            z.string(),
            z.any()
          )
      },
      ...writeToolMetadata
    },
    async ({
      request_id,
      return_capability,
      artifact_type,
      payload
    }) => {
      try {
        const { data, error } =
          await supabase.rpc(
            "guild_store_artifact",
            {
              requested_request_id:
                request_id,
              supplied_capability:
                return_capability,
              supplied_artifact_type:
                artifact_type,
              supplied_payload:
                payload
            }
          );

        if (error) {
          throw error;
        }

        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "submit_guild_response",
    {
      title: "Return Guild Response",
      description:
        "Store the final answer for one capability-scoped Quest Board Guild request so the app can retrieve it. Call this after any artifact writes, or by itself for counsel/read-only answers. Never claim Quest Board saved something unless the relevant tool confirmed it.",
      inputSchema: {
        ...requestSchema,

        response_text:
          z.string()
            .min(1)
            .max(20000),

        response_payload:
          z.record(
            z.string(),
            z.any()
          )
          .optional()
      },
      ...writeToolMetadata
    },
    async ({
      request_id,
      return_capability,
      response_text,
      response_payload
    }) => {
      try {
        const { data, error } =
          await supabase.rpc(
            "guild_submit_response",
            {
              requested_request_id:
                request_id,
              supplied_capability:
                return_capability,
              supplied_response_text:
                response_text,
              supplied_response_payload:
                response_payload || {}
            }
          );

        if (error) {
          throw error;
        }

        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  return server;
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "quest-board-guild",
    auth: "capability-scoped"
  });
});

async function handleMcpRequest(
  req,
  res
) {
  const server =
    buildServer();

  const transport =
    new StreamableHTTPServerTransport({
      sessionIdGenerator:
        undefined,

      enableJsonResponse:
        true
    });

  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  try {
    await server.connect(
      transport
    );

    await transport.handleRequest(
      req,
      res,
      req.body
    );
  } catch (error) {
    console.error(
      "Quest Board MCP request failed:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        error:
          "Internal Quest Board Guild MCP error"
      });
    }
  }
}

app.post(
  "/mcp",
  handleMcpRequest
);

app.get(
  "/mcp",
  handleMcpRequest
);

app.delete(
  "/mcp",
  handleMcpRequest
);

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found"
  });
});

const port =
  Number(
    process.env.PORT ||
    3000
  );

app.listen(
  port,
  "0.0.0.0",
  () => {
    console.log(
      `Quest Board Guild MCP listening on port ${port}`
    );
  }
);
