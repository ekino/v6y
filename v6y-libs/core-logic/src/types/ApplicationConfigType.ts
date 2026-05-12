export interface DataDogConfigType {
    apiKey: string;
    appKey: string;
    url: string;
    monitorId: string;
}

export interface SonarQubeConfigType {
    token: string;
}

export interface ApplicationConfigType {
    dataDog?: DataDogConfigType;
    sonarqube?: SonarQubeConfigType;
}
