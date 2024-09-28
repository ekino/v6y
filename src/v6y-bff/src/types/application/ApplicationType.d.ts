declare const ApplicationType = "\n  type ApplicationType {\n    \"\"\" App Unique id \"\"\"\n    _id: Int!\n    \n    \"\"\" APP Name (full name) \"\"\"\n    name: String!\n    \n    \"\"\" APP Acronym (abbreviation, trigram, ...) \"\"\"\n    acronym: String!\n    \n    \"\"\" APP Contact Mail \"\"\"\n    contactMail: String!\n    \n    \"\"\" APP Description \"\"\"\n    description: String!\n    \n    \"\"\" First matched APP Web Repository Information \"\"\"\n    repo: RepositoryType!\n    \n    \"\"\" Application links: prod, gitlab, github, aws \"\"\"\n    links: [LinkType]\n  }\n";
export default ApplicationType;
