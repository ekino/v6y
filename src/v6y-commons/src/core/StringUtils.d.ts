declare const StringUtils: {
    encodeBase64: (value: string) => string;
    decodeBase64: (value: string) => string;
    parseJsonString: (value: string) => any;
    parseEncodedJsonString: (value: string) => any;
};
export default StringUtils;
