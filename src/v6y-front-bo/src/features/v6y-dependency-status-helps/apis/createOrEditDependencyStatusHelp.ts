import { gql } from 'graphql-request';

const CreateOrEditDependencyStatusHelp = gql`
    mutation CreateOrEditDependencyStatusHelp(
        $dependencyStatusHelpInput: DependencyStatusHelpCreateOrEditInput!
    ) {
        createOrEditDependencyStatusHelp(dependencyStatusHelpInput: $dependencyStatusHelpInput) {
            _id
        }
    }
`;

export default CreateOrEditDependencyStatusHelp;
