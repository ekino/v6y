import { gql } from 'graphql-request';

const CreateOrEditDependencyVersionStatusHelp = gql`
    mutation CreateOrEditDependencyVersionStatusHelp(
        $dependencyVersionStatusHelpInput: DependencyVersionStatusHelpCreateOrEditInput!
    ) {
        createOrEditDependencyVersionStatusHelp(
            dependencyVersionStatusHelpInput: $dependencyVersionStatusHelpInput
        ) {
            _id
        }
    }
`;

export default CreateOrEditDependencyVersionStatusHelp;
