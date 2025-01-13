import { gql } from 'graphql-request';

const DeleteNotification = gql`
    mutation DeleteNotification($input: NotificationDeleteInput!) {
        deleteNotification(input: $input) {
            _id
        }
    }
`;

export default DeleteNotification;
