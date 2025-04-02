const AuditReportType = `
  type AuditReportType {
    """ Audit Unique id """
    _id: Int!

    """ Audit type (lighthouse, Code security, Code compliance, Code complexity, Code complexity, Code duplication, Code coupling) """
    type: String

    """ Audit category (performance, seo, accessibility, first-contentful-paint, largest-contentful-paint, cumulative-layout-shift, cyclomatic-complexity, maintainability-index, ...) """
    category: String
    
    """ Audit sub category (mobile, desktop, 3G, 4G, ...) """
    subCategory: String

    """ Audit status (success, failure) """
    auditStatus: String

    """ Audit score status (success, info, warning, error) """
    scoreStatus: String
        
    """ Audit score """
    score: Float 
    
    """ Audit metric score unit """
    scoreUnit: String  
   
    """ Audit extra infos """
    extraInfos: String  
     
    """ Audit Concerned Module """
    module: ModuleType
    
    """ Audit help """
    auditHelp: AuditHelpType  
  }
`;

export default AuditReportType;
