const NotificationType = `
  type NotificationType {
    """ Notification Unique id """
    _id: String!
    
    """ Notification Title """
    title: String!
    
    """ Notification Description Details """
    description: String!
    
    """ Notification Legend Color """
    color: Int!
    
    """ Notification Extra Links """
    links: [LinkType]
  }
`;

export default NotificationType;
