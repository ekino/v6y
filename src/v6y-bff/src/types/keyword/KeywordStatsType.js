const KeywordStatsType = `
  """ Keyword related stats (number of apps including this keyword, ...) """
  type KeywordStatsType {
    """ Keyword Infos """
    keyword: KeywordType!
   
    """ Keyword Total """
    total: Int
  }
`;

export default KeywordStatsType;
