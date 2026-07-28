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

    """ Application creation date """
    createdAt: String

    """ Application last update date """
    updatedAt: String
    
    """ First matched APP Web Repository Information """
    repo: RepositoryType

    """ APP Configuration """
    configuration: ApplicationConfigType
    
    """ Application links: prod, gitlab, github, aws """
    links: [LinkType]

    """ Whether recurring audit scheduling is enabled for this application """
    auditFrequencyEnabled: Boolean

    """ Audit reporting frequency, expressed as a 5-field cron expression """
    auditFrequencyCron: String
  }
`;

export default ApplicationType;
