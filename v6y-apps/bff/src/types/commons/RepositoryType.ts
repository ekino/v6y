const RepositoryType = `
  type RepositoryType {
    """ Repository web url """
    webUrl: String
    
    """ Repository git url """
    gitUrl: String  
    
    """ Repository Name """
    name: String
    
     """ Repository Organization """
    organization: String
    
    """ Default branch to audit """
    defaultBranch: String
        
    """ Repository all related branches """
    allBranches: [String]                  
  }
`;

export default RepositoryType;
