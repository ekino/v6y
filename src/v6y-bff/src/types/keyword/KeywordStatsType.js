const KeywordStatsType = `
  """ Keyword related stats (number of apps including this keyword, ...) """
  type KeywordStatsType {
    """ Keyword Label """
    keyword: String!
   
    """ Keyword Total """
    total: Int
  }
`;

export default KeywordStatsType;
