const QualityGateType = `
  """ Quality Gate is a metric to measure the conformity of a project to a recommended rule. """
  type QualityGateType {
    """ QualityGate Unique id """
    _id: String!
    
    """ Quality Gate label (exp: Performance, Architecture, Security, ...) """
    label: String!
    
    """ Quality Gate Branch """
    branch: String
    
    """ Quality Gate level. Possible values are: PASSED, FAILED """
    level: String!    
    
    """ Quality Gate color for level """
    color: String
    
    """ Module where quality gate is executed """
    module: String
    
    """ Help message to explain the Quality Gate purpose """
    helpMessage: String 
    
    """ Detailed error for quality gate fail """
    errorDetails: String
    
    """ Error stack trace for quality gate fail """
    errorStackTrace: String
  }
`;

export default QualityGateType;
