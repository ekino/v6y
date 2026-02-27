declare module '@creedengo/eslint-plugin' {
    import { Rule } from 'eslint';

    interface CreedengoPlugin {
        rules: Record<string, Rule.RuleModule>;
    }

    const plugin: CreedengoPlugin;

    export default plugin;
}
