const AppType = `
  type AppType {
    """ App Unique id """
    _id: String!
    
    """ APP Name """
    name: String!
    
    """ APP Description """
    description: String
    
    """ First matched APP Web Repository Information """
    repo: RepositoryType!
    
    """ Application links: prod, gitlab, github, aws """
    links: [LinkType]
     
    """ Needed keywords to help searching (exp: React, Angular, ...) """
    keywords: [KeywordType]

    """ Quality gates status for the current APP WEB """
    qualityGates: [QualityGateType]
 
    """ List of suggest evolutions according to quality gates status """
    evolutions: [EvolutionType]

    """ List of dependencies """
    dependencies: [DependencyType]
  }
`;

export default AppType;
