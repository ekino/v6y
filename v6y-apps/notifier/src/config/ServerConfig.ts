const buildNotifierConfig = () => {
    const port = parseInt(process.env.V6Y_NOTIFIER_PORT || '4004', 10);
    const serverUrl = `http://localhost:${port}`;
    const monitoringPath = process.env.V6Y_NOTIFIER_MONITORING_PATH || '/monitoring';

    return {
        port,
        serverUrl,
        monitoringPath,
        serverTimeout: parseInt(process.env.V6Y_NOTIFIER_TIMEOUT || '30000', 10),
    };
};

const currentConfig = buildNotifierConfig();

const ServerConfig = { currentConfig };

export default ServerConfig;
