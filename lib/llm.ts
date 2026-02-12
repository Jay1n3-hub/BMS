import OpenAI from "openai";

export type LlmClassification = {
  category: "Requirements/BA" | "Technical" | "Process" | "External";
  confidence: number;
  actionPlan: {
    priority: "Low" | "Medium" | "High" | "Critical";
    ownerSuggestion: string;
    escalationPath: string;
    nextSteps: string[];
  };
};

const fallback = (text: string): LlmClassification => {
  const lower = text.toLowerCase();
  const category = lower.includes("dependency")
    ? "External"
    : lower.includes("spec") || lower.includes("requirement")
      ? "Requirements/BA"
      : lower.includes("deploy") || lower.includes("error")
        ? "Technical"
        : "Process";

  return {
    category,
    confidence: 0.62,
    actionPlan: {
      priority: category === "Technical" ? "High" : "Medium",
      ownerSuggestion: "Scrum Master",
      escalationPath: "Escalate to Engineering Manager within 24h if still blocked.",
      nextSteps: [
        "Reproduce blocker with exact context and impacted work items.",
        "Assign clear owner and deadline in sprint board.",
        "Schedule 15-minute unblocker sync."
      ]
    }
  };
};

export const classifyBlocker = async (text: string, metadata: Record<string, string>) => {
  if (!process.env.OPENAI_API_KEY) {
    return fallback(text);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-5.3-codex";

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Classify scrum blockers into one category: Requirements/BA, Technical, Process, External. Return JSON with keys category, confidence (0-1), and actionPlan {priority, ownerSuggestion, escalationPath, nextSteps[]}"
      },
      {
        role: "user",
        content: `Blocker: ${text}\nMetadata: ${JSON.stringify(metadata)}`
      }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return fallback(text);

  const parsed = JSON.parse(content) as LlmClassification;
  return parsed;
};

export const summarizeWeeklyImprovements = async (reportData: unknown) => {
  if (!process.env.OPENAI_API_KEY) {
    return "Standardize blocker triage in daily stand-up, add clear owner SLAs, and pre-validate cross-team dependencies before sprint planning.";
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-5.3-codex";

  const response = await client.chat.completions.create({
    model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "Provide 3 concise process improvements from blocker analytics for scrum teams."
      },
      { role: "user", content: JSON.stringify(reportData) }
    ]
  });

  return response.choices[0]?.message?.content || "No suggestions generated.";
};
