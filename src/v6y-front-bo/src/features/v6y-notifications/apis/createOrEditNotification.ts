import { gql } from 'graphql-request';

const CreateOrEditNotification = gql`
    mutation CreateOrEditNotification($notificationInput: NotificationCreateOrEditInput!) {
        createOrEditNotification(notificationInput: $notificationInput) {
            _id
        }
    }
`;

export default CreateOrEditNotification;
