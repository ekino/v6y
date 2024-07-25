const VitalityBotSettings = {
    themes: [{ id: 'rosa', version: '0.1.0' }],
    styles: {
        footerStyle: {
            padding: '1.2rem',
        },
    },
    settings: {
        general: {
            embedded: false,
        },
        tooltip: {
            mode: 'never',
        },
        header: {
            showAvatar: true,
            title: (
                <span
                    style={{
                        fontWeight: 'lighter',
                        fontSize: '1.5rem',
                    }}
                >
                    Vitality Bot
                </span>
            ),
        },
        footer: {
            buttons: null,
            text: null,
        },
        audio: {
            disabled: false,
            icon: null,
        },
        notification: {
            showCount: false,
            disabled: true,
        },
        chatHistory: {
            storageKey: 'vitality_bot_chatHistory',
        },
        botBubble: {
            showAvatar: false,
        },
        userBubble: {
            showAvatar: false,
        },
    },
};

export default VitalityBotSettings;
