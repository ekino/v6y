const KeywordType = `
  """ A Keyword can identify the type of the app, the language used, the type of backend used, .... """
  type KeywordType {
    """ Keyword Unique id """
    _id: Int!

    """ Keyword Related App Id """
    appId: Int!
    
    """ Keyword label (exp: React, Angular, Vite, Webpack, Jest, Vitest, ...) """
    label: String!

    """ Keyword Concerned Module """
    module: ModuleType
  }
`;

export default KeywordType;
