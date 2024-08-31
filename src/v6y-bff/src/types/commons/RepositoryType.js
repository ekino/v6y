const RepositoryType = `
  type RepositoryType {
    """ Repository web url """
    webUrl: String
    
    """ Repository git url """
    gitUrl: String  
    
    """ Repository Name """
    name: String
    
    """ Repository full name """
    fullName: String
    
    """ Repository owner """
    owner: String
        
    """ Repository all related branches """
    allBranches: [String]                  
  }
`;

export default RepositoryType;
