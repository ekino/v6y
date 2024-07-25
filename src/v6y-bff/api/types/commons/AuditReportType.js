const AuditReportType = `
  type AuditReportType {
    """ Audit Unique id """
    _id: String!
    
    """ App Unique id """
    appId: String!
    
    """ Audit type (lighthouse, axe, unit tests, code quality, security ...) """
    type: String

    """ Audit category (performance, a11y, w3c, no unit tests, ...) """
    category: String
    
    """ Audit sub category (mobile, desktop, 3G, 4G, ...) """
    subCategory: String
        
    """ Audit title """
    title: String
    
    """ Audit description """
    description: String
    
    """ Audit web url (app link, github link, ...) """
    webUrl: String
         
    """ Audit status """
    status: String
        
    """ Audit score """
    score: Float 

    """ Audit max score """
    scoreMax: Float

    """ Audit min score """
    scoreMin: Float
        
    """ Audit score percent """
    scorePercent: Float
    
    """ Audit metric score unit """
    scoreUnit: String 
    
    """ Audit branch """
    branch: String      
  }
`;

export default AuditReportType;
