import { Button } from '@/components/ui/button';
import { DatagridActionsMenu } from '@/components/ui/datagrid';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';

const item = { id: 1, name: 'User 1' };

const actions = [{ label: 'Edit' }];

const mockT = vi.fn((key: string) => {
    const translations: Record<string, string> = {
        "There aren't any": "There aren't any",
        found: 'found',
        item: 'items',
    };
    return translations[key] || key;
});

describe('DatagridActionsMenu.vue', () => {
    it('performs action when edit button is clicked', async () => {
        const { emitted } = render(
            {
                components: { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DatagridActionsMenu },
                template: `
                    <DropdownMenu>
                    <DropdownMenuTrigger>Opções</DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <DatagridActionsMenu :item="item" :actions="actions" />
                    </DropdownMenuContent>
                    </DropdownMenu>
                `,
                setup() {
                    return { item, actions };
                },
            },
            {
                global: {
                    components: { Button },
                    mocks: { $t: mockT, $tc: mockT },
                },
            },
        );

        await fireEvent.click(screen.getByRole('button'));

        await fireEvent.click(screen.getByText('Edit'));

        expect(emitted().click).toBeTruthy();
    });
});
