const KeywordType = `
  """ A Keyword can identify the type of the app, the language used, the type of backend used, .... """
  type KeywordType {
    """ Keyword Unique id """
    _id: String!
    
    """ Evolution associated to the keyword """
    evolutionId: String
    
    """ Keyword label (exp: React, Angular, Vite, Webpack, Jest, Vitest, ...) """
    label: String

    """ Keyword version (displayed as: label(version)) """
    version: String
      
    """ Possible values for status : error, success, warning """
    status: String
    
    """ Help message to explain the keyword purpose """
    helpMessage: String
  }
`;

export default KeywordType;
