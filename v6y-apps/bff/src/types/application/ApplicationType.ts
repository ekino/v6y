const ApplicationType = `
  type ApplicationType {
    """ App Unique id """
    _id: Int
    
    """ APP Name (full name) """
    name: String
    
    """ APP Acronym (abbreviation, trigram, ...) """
    acronym: String
    
    """ APP Contact Mail """
    contactMail: String
    
    """ APP Description """
    description: String
    
    """ First matched APP Web Repository Information """
    repo: RepositoryType

    """ APP Configuration """
    configuration: ApplicationConfigType
    
    """ Application links: prod, gitlab, github, aws """
    links: [LinkType]
  }
`;

export default ApplicationType;
