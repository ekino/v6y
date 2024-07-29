const NotificationType = `
  type NotificationType {
    """ Notification Title """
    title: String!
    
    """ Notification Description Details """
    description: String!
    
    """ Notification Legend Color """
    color: Int!
    
    """ Notification Extra Help Links """
    links: [LinkType]
  }
`;

export default NotificationType;
