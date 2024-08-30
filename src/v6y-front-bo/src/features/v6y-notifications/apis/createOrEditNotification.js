import { gql } from 'graphql-request';

const CreateOrEditNotification = gql`
    mutation CreateOrEditNotification($notificationInput: NotificationCreateOrEditInput!) {
        createOrEditNotification(notificationInput: $notificationInput) {
            id: _id
        }
    }
`;

export default CreateOrEditNotification;
