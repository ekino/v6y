const AuditReportType = `
  type AuditReportType {
    """ Audit Unique id """
    _id: String!
    
    """ App Unique id """
    appId: String!
    
    """ Audit type (lighthouse, Code security, Code compliance, Code complexity, Code complexity, Code duplication, Code coupling) """
    type: String

    """ Audit category (performance, seo, accessibility, first-contentful-paint, largest-contentful-paint, cumulative-layout-shift, cyclomatic-complexity, maintainability-index, ...) """
    category: String
    
    """ Audit sub category (mobile, desktop, 3G, 4G, ...) """
    subCategory: String
        
    """ Audit title """
    title: String
    
    """ Audit description (detailed description that describes why the audit is important) """
    description: String
    
    """ Audit explanation (the reason for audit failure) """
    explanation: String
    
    """ Audit web url (app link, github link, ...) """
    webUrl: String
         
    """ Audit status """
    status: String
        
    """ Audit score """
    score: Float 

    """ Audit score percent """
    scorePercent: Float
    
    """ Audit metric score unit """
    scoreUnit: String 
    
    """ Audit branch """
    branch: String   
    
    """ Audit module (apps/frontend/index.js, ...) """
    module: String      
  }
`;

export default AuditReportType;
