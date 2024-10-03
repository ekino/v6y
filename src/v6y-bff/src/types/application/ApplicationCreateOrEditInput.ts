const ApplicationCreateOrEditInput = `
  input ApplicationCreateOrEditInput {
      """ App Unique id """
      _id: Int
        
      """ APP Acronym (abbreviation, trigram, ...) """
      acronym: String!
        
      """ APP Name (full name) """
      name: String!
        
      """ APP Description """
      description: String!
      
      """ Application repository organization """
      gitOrganization: String!
      
      """ Application web repository url """
      gitWebUrl: String!
        
      """ Application git repository url """
      gitUrl: String!
        
      """ Application production url """
      productionLink: String!
      
      """ Additional Application production urls """
      additionalProductionLinks: [String]
       
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

export default ApplicationCreateOrEditInput;
