type JiraIssuePayload = {
  summary: string;
  description: string;
};

const headers = () => {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!email || !token) return null;

  const basic = Buffer.from(`${email}:${token}`).toString("base64");
  return {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/json"
  };
};

export const createJiraIssue = async (payload: JiraIssuePayload) => {
  const authHeaders = headers();
  const baseUrl = process.env.JIRA_BASE_URL;
  const projectKey = process.env.JIRA_PROJECT_KEY;

  if (!authHeaders || !baseUrl || !projectKey) {
    return null;
  }

  const response = await fetch(`${baseUrl}/rest/api/3/issue`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      fields: {
        project: { key: projectKey },
        summary: payload.summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: payload.description }]
            }
          ]
        },
        issuetype: { name: "Task" }
      }
    })
  });

  if (!response.ok) return null;
  return (await response.json()) as { id: string; key: string; self: string };
};

export const addJiraComment = async (issueKey: string, comment: string) => {
  const authHeaders = headers();
  const baseUrl = process.env.JIRA_BASE_URL;
  if (!authHeaders || !baseUrl) return false;

  const response = await fetch(`${baseUrl}/rest/api/3/issue/${issueKey}/comment`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      body: {
        type: "doc",
        version: 1,
        content: [{ type: "paragraph", content: [{ type: "text", text: comment }] }]
      }
    })
  });

  return response.ok;
};
