const NotificationCreateOrEditInput = `
  input NotificationCreateOrEditInput {
    """ Notification Unique id """
    _id: Int
      
    """ NOTIFICATION Question """
    title: String!
    
    """ NOTIFICATION Question Response """
    description: String!
    
    """ NOTIFICATION Extra Links """
    links: [String]
  }
`;

export default NotificationCreateOrEditInput;
