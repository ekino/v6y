const AuditReportType = `
  type AuditReportType {
    """ Audit Unique id """
    _id: String!

    """ Audit type (lighthouse, Code security, Code compliance, Code complexity, Code complexity, Code duplication, Code coupling) """
    type: String

    """ Audit category (performance, seo, accessibility, first-contentful-paint, largest-contentful-paint, cumulative-layout-shift, cyclomatic-complexity, maintainability-index, ...) """
    category: String
    
    """ Audit sub category (mobile, desktop, 3G, 4G, ...) """
    subCategory: String

    """ Audit status """
    status: String
        
    """ Audit score (success, warning, error) """
    score: Float 

    """ Audit score percent """
    scorePercent: Float
    
    """ Audit metric score unit """
    scoreUnit: String  
    
    """ Audit Concerned Module """
    module: ModuleType
    
    """ Audit help """
    auditHelp: AuditHelpType  
  }
`;

export default AuditReportType;
