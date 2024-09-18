const ApplicationType = `
  type ApplicationType {
    """ App Unique id """
    _id: String!
    
    """ APP Name (full name) """
    name: String!
    
    """ APP Acronym (abbreviation, trigram, ...) """
    acronym: String!
    
    """ APP Contact Mail """
    contactMail: String!
    
    """ APP Description """
    description: String!
    
    """ First matched APP Web Repository Information """
    repo: RepositoryType!
    
    """ Application links: prod, gitlab, github, aws """
    links: [LinkType]
  }
`;

export default ApplicationType;
