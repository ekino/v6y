const AiSummaryMutationsType = `
  type Mutation {
    """ Generates a fresh, generic AI summary report for an application
        (purpose, tech stack and current audit health) and caches it,
        overwriting any previous summary for that application. "language"
        (e.g. "en"/"fr") controls the language of the generated summary and
        defaults to English when omitted. """
    generateApplicationAiSummary(applicationId: Int!, language: String): GenerateAiSummaryOutput
  }
`;

export default AiSummaryMutationsType;
