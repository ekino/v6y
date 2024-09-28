declare const FaqType = "\n  type FaqType {\n    \"\"\" FAQ Unique id \"\"\"\n    _id: Int!\n    \n    \"\"\" FAQ Question \"\"\"\n    title: String!\n    \n    \"\"\" FAQ Question Response \"\"\"\n    description: String!\n    \n    \"\"\" FAQ Extra Links \"\"\"\n    links: [LinkType]\n  }\n";
export default FaqType;
