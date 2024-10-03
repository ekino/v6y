const helpOptions = ['Quickstart', 'Ekino Gems', 'Ekino Bistro Kit', 'Issue or Suggestion'];

export const VitalityBotFlow = {
    start: {
        message: 'Hello, I am  Vibe, your Vitality helper bot!',
        transition: { duration: 1000 },
        path: 'show_options',
    },
    show_options: {
        message:
            'It looks like you have not set up a conversation flow yet. No worries! Here are a few helpful ' +
            'things you can check out to get started:',
        options: helpOptions,
        path: 'process_options',
    },
    prompt_again: {
        message: 'Do you need any other help?',
        options: helpOptions,
        path: 'process_options',
    },
    unknown_input: {
        message:
            'Sorry, I do not understand your message! If you require further assistance, you may click on ' +
            'the Github option and open an issue there.',
        options: helpOptions,
        path: 'process_options',
    },
    process_options: {
        transition: { duration: 0 },
        chatDisabled: true,
        path: async (params: {
            userInput: string;
            injectMessage: (message: string) => Promise<void>;
        }) => {
            let link = '';
            switch (params.userInput) {
                case 'Quickstart':
                    link = 'https://github.com/ekino/v6y?tab=readme-ov-file#usage';
                    break;
                case 'Ekino Gems':
                    link = 'https://github.com/ekino/gems';
                    break;
                case 'Ekino Bistro Kit':
                    link = 'https://github.com/ekino/bistro';
                    break;
                case 'Issue or Suggestion':
                    link = 'https://github.com/ekino/v6y/issues/new/choose';
                    break;
                default:
                    return 'unknown_input';
            }
            await params.injectMessage("Sit tight! I'll send you right there!");
            setTimeout(() => {
                window.open(link);
            }, 1000);
            return 'repeat';
        },
    },
    repeat: {
        transition: { duration: 3000 },
        path: 'prompt_again',
    },
};
