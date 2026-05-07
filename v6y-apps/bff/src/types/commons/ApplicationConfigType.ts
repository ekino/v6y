const ApplicationConfigType = `
    type ApplicationConfigType {
        """ DataDog configuration """
        dataDog: DataDogConfigType
        """ SonarQube configuration """
        sonarqube: SonarQubeConfigType
    }
`;
export default ApplicationConfigType;
