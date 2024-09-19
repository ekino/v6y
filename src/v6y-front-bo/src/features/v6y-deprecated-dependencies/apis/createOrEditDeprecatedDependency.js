import { gql } from 'graphql-request';

const CreateOrEditDeprecatedDependency = gql`
    mutation CreateOrEditDeprecatedDependency(
        $deprecatedDependencyInput: DeprecatedDependencyCreateOrEditInput!
    ) {
        createOrEditDeprecatedDependency(deprecatedDependencyInput: $deprecatedDependencyInput) {
            id: _id
        }
    }
`;

export default CreateOrEditDeprecatedDependency;
