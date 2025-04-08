const DataDogConfigType = `
    """ DataDog configuration """
    type DataDogConfigType {
        """ DataDog API Key """
        apiKey: String

        """ DataDog Application Key """
        appKey: String

        """ DataDog url """
        url: String

        """ DataDog Monitor ID """
        monitorId: String
    }
`;

export default DataDogConfigType;
