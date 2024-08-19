const AppType = `
  type AppType {
    """ App Unique id """
    _id: String!
    
    """ APP Name (full name) """
    name: String!
    
    """ APP Acronym (abbreviation, trigram, ...) """
    acronym: String!
    
    """ APP Contact Mails """
    mails: [String]!
    
    """ APP Description """
    description: String
    
    """ First matched APP Web Repository Information """
    repo: RepositoryType!
    
    """ Application links: prod, gitlab, github, aws """
    links: [LinkType]
     
    """ Needed keywords to help searching (exp: React, Angular, ...) """
    keywords: [KeywordType]
  }
`;

export default AppType;
