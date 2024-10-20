import {
    AppLogger,
    NotificationInputType,
    NotificationProvider,
    SearchQueryType,
} from '@v6y/commons';

/**
 * Create or edit notification
 * @param _
 * @param params
 */
const createOrEditNotification = async (
    _: unknown,
    params: { notificationInput: NotificationInputType },
) => {
    try {
        const { _id, title, description, links } = params?.notificationInput || {};

        AppLogger.info(`[NotificationMutations - createOrEditNotification] _id : ${_id}`);
        AppLogger.info(`[NotificationMutations - createOrEditNotification] title : ${title}`);
        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] description : ${description}`,
        );
        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] links : ${links?.join(',')}`,
        );

        if (_id) {
            const editedNotification = await NotificationProvider.editNotification({
                _id,
                title,
                description,
                links,
            });

            AppLogger.info(
                `[NotificationMutations - createOrEditNotification] editedNotification : ${editedNotification?._id}`,
            );

            return {
                _id,
            };
        }

        const createdNotification = await NotificationProvider.createNotification({
            title,
            description,
            links,
        });

        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] createdNotification : ${createdNotification?._id}`,
        );

        return createdNotification;
    } catch (error) {
        AppLogger.info(`[NotificationMutations - createOrEditNotification] error : ${error}`);
        return null;
    }
};

/**
 * Delete notification
 * @param _
 * @param params
 */
const deleteNotification = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const notificationId = whereClause.id;
        if (!notificationId) {
            return null;
        }

        AppLogger.info(
            `[NotificationMutations - deleteNotification] notificationId : ${notificationId}`,
        );

        await NotificationProvider.deleteNotification({ _id: parseInt(notificationId, 10) });

        return {
            _id: notificationId,
        };
    } catch (error) {
        AppLogger.info(`[NotificationMutations - deleteNotification] error : ${error}`);
        return null;
    }
};

const NotificationMutations = {
    createOrEditNotification,
    deleteNotification,
};

export default NotificationMutations;
