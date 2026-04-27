const SonarQubeMetricsType = `
    """ A single SonarQube metric value """
    type SonarQubeMetricType {
        """ Metric key (e.g. coverage, bugs) """
        key: String

        """ Human-readable metric name """
        name: String

        """ Metric value as string """
        value: String

        """ Rating level 1-5 (for ratings) """
        rating: String
    }

    """ SonarQube quality gate status """
    type SonarQubeQualityGateType {
        """ Overall gate status: OK, WARN, ERROR, NONE """
        status: String

        """ Gate name """
        name: String
    }

    """ Full SonarQube metrics response """
    type SonarQubeMetricsType {
        """ Project key """
        projectKey: String

        """ SonarQube instance base URL """
        baseUrl: String

        """ Quality gate result """
        qualityGate: SonarQubeQualityGateType

        """ Individual metric values """
        metrics: [SonarQubeMetricType]

        """ Whether the data was fetched successfully """
        success: Boolean

        """ Error message if fetching failed """
        error: String
    }
`;

export default SonarQubeMetricsType;
