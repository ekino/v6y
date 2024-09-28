declare const FaqCreateOrEditInput = "\n  input FaqCreateOrEditInput {\n    \"\"\" Faq Unique id \"\"\"\n    _id: Int!\n      \n    \"\"\" FAQ Question \"\"\"\n    title: String!\n    \n    \"\"\" FAQ Question Response \"\"\"\n    description: String!\n    \n    \"\"\" FAQ Extra Links \"\"\"\n    links: [String]\n  }\n";
export default FaqCreateOrEditInput;
