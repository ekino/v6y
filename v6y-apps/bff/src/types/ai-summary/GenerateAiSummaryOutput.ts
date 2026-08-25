const GenerateAiSummaryOutput = `
  type GenerateAiSummaryOutput {
    """ Whether a summary was generated and saved successfully """
    success: Boolean!

    """ Human readable message, notably describing failures (e.g. the
        application not being found, or the LLM provider being unavailable) """
    message: String!

    """ The resulting summary report, present when success is true """
    report: AiSummaryReportType
  }
`;

export default GenerateAiSummaryOutput;
