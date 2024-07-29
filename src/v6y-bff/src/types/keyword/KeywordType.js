const KeywordType = `
  """ A Keyword can identify the type of the app, the language used, the type of backend used, .... """
  type KeywordType {
    """ Keyword Unique id """
    _id: String!
    
    """ Keyword Type (frontend/backend/Project) """
    type: String
    
    """ Keyword Branch """
    branch: String
    
    """ Keyword label (exp: React, Angular, Vite, Webpack, Jest, Vitest, ...) """
    label: String
    
    """ Keyword color for level (error/success/warning/info) """
    color: String
    
    """ Help message to explain the keyword purpose """
    helpMessage: String
  }
`;

export default KeywordType;
