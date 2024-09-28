const AuditHelpCreateOrEditInput = `
  input AuditHelpCreateOrEditInput {
    """ AuditHelp Unique id """
    _id: Int!
      
    """ Audit Help Title """
    title: String!
    
    """ Audit Help Description """
    description: String!
    
    """ Audit Help Category """
    category: String! 
    
    """ Audit Help explanation (the reason for audit failure) """
    explanation: String
  }
`;

export default AuditHelpCreateOrEditInput;
