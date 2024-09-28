declare const AuditReportType = "\n  type AuditReportType {\n    \"\"\" Audit Unique id \"\"\"\n    _id: Int!\n\n    \"\"\" Audit type (lighthouse, Code security, Code compliance, Code complexity, Code complexity, Code duplication, Code coupling) \"\"\"\n    type: String\n\n    \"\"\" Audit category (performance, seo, accessibility, first-contentful-paint, largest-contentful-paint, cumulative-layout-shift, cyclomatic-complexity, maintainability-index, ...) \"\"\"\n    category: String\n    \n    \"\"\" Audit sub category (mobile, desktop, 3G, 4G, ...) \"\"\"\n    subCategory: String\n\n    \"\"\" Audit status (success, warning, error, info) \"\"\"\n    status: String\n        \n    \"\"\" Audit score \"\"\"\n    score: Float \n    \n    \"\"\" Audit metric score unit \"\"\"\n    scoreUnit: String  \n   \n    \"\"\" Audit extra infos \"\"\"\n    extraInfos: String  \n     \n    \"\"\" Audit Concerned Module \"\"\"\n    module: ModuleType\n    \n    \"\"\" Audit help \"\"\"\n    auditHelp: AuditHelpType  \n  }\n";
export default AuditReportType;
