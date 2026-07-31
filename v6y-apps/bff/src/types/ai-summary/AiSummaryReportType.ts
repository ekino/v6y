const AiSummaryReportType = `
  type AiSummaryReportType {
    """ AI summary report unique id """
    _id: Int!

    """ Application id this summary belongs to """
    appId: Int!

    """ Short, LLM-generated overview of the application (purpose, tech stack
        and current audit health), independent of any specific audit report """
    summary: String!

    """ Overall application health score from 0 (critical) to 10 (excellent),
        generated alongside the summary and consistent with its bullet points """
    score: Int

    """ The LLM model that generated this summary (as routed by LiteLLM) """
    model: String

    """ Total tokens consumed generating this summary, when reported by the provider """
    tokensUsed: Int

    """ When this summary was (last) generated """
    generatedAt: String
  }
`;

export default AiSummaryReportType;
