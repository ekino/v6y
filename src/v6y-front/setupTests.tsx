import { vi } from 'vitest';

vi.mock('next/dynamic', async () => {
    const dynamicModule = await vi.importActual('next/dynamic');
    return {
        default: (loader: unknown) => {
            const dynamicActualComp = dynamicModule.default;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const RequiredComponent = dynamicActualComp(loader);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            RequiredComponent.preload
                ? RequiredComponent.preload()
                : RequiredComponent.render.preload();
            return RequiredComponent;
        },
    };
});
