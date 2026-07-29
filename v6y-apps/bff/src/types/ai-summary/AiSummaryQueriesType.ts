const AiSummaryQueriesType = `
  type Query {
    """ Returns the application's cached AI summary report, if one has ever
        been generated (a generic overview, not tied to any specific audit
        report) """
    getApplicationAiSummaryByParams(_id: Int!): AiSummaryReportType
  }
`;

export default AiSummaryQueriesType;
