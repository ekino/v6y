const AuditHelpType = `
  type AuditHelpType {
    """ Audit Help Unique id """
    _id: String!
  
    """ Audit Help Category """
    category: String! 
    
    """ Audit Help title """
    title: String!
    
    """ Audit Help description (detailed description that describes why the audit is important) """
    description: String!
    
    """ Audit Help explanation (the reason for audit failure) """
    explanation: String
  }
`;

export default AuditHelpType;
