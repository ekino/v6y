/**
 * Sleep for the given number of milliseconds.
 * @param millis
 */
export const sleep = async (millis: number) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
};
