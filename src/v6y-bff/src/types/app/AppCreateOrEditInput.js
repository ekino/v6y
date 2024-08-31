const AppCreateOrEditInput = `
  input AppCreateOrEditInput {
      """ App Unique id """
      appId: String
        
      """ APP Acronym (abbreviation, trigram, ...) """
      acronym: String!
        
      """ APP Name (full name) """
      name: String!
        
      """ APP Description """
      description: String!
      
      """ Application web repository url """
      gitWebUrl: String!
        
      """ Application git repository url """
      gitUrl: String!
        
      """ Application production url """
      productionLink: String!
       
      """ APP Contact Mail """
      contactMail: String!
      
      """ Application code quality platform url """
      codeQualityPlatformLink: String
      
      """ Application CI/CD platform url """
      ciPlatformLink: String
      
      """ Application deployment platform url """
      deploymentPlatformLink: String
  }
`;

export default AppCreateOrEditInput;
