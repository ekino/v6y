declare const ApplicationDeleteInput = "\n  input ApplicationDeleteInputClause {\n      \"\"\" Application to delete id \"\"\"\n      _id: Int!\n  }\n  \n  input ApplicationDeleteInput {\n      \"\"\" Application to delete id \"\"\"\n      where: ApplicationDeleteInputClause!\n  }\n";
export default ApplicationDeleteInput;
