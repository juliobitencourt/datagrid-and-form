import Datagrid from '@/components/ui/datagrid/Datagrid.vue';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';

const gridTitle = 'Users';

interface Column {
    key: string;
    label: string;
}

const columns: Column[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
];

// const actions = [
//   { label: 'Edit', handler: vi.fn() }
// ]

const data = {
    items: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
    ],
};

const mockT = vi.fn((key: string) => {
    const translations: Record<string, string> = {
        "There aren't any": "There aren't any",
        found: 'found',
        item: 'item',
        items: 'items',
    };
    return translations[key] || key;
});

describe('Datagrid.vue', () => {
    describe('Rendering', () => {
        it('renders the columns correctly', () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            columns.forEach((column) => {
                expect(screen.getByText(column.label)).toBeInTheDocument();
            });
        });

        it('not renders the columns when showHeader is false', () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: false,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            columns.forEach((column) => {
                expect(screen.queryByText(column.label)).not.toBeInTheDocument();
            });
        });

        it('renders data correctly', () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            data.items.forEach((item) => {
                expect(screen.getByText(item.name)).toBeInTheDocument();
            });
        });

        it('shows message "There aren\'t any users" when the list is empty', () => {
            const emptyData = { items: [], links: [] };

            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data: emptyData,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            expect(screen.getByText(`No items found.`)).toBeInTheDocument();
        });

        it.skip('shows skeleton when loading', async () => {
            //
        });

        it('shows counter', async () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: {
                    mocks: { $t: mockT, $tc: mockT },
                },
            });

            expect(screen.getByText('2 users found')).toBeInTheDocument();
        });
    });

    describe('Selection', () => {
        it('shows counter of selected items when all items are selected', async () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
            await fireEvent.click(checkbox);
            await expect(screen.findByText('2 items selected')).resolves.toBeInTheDocument();
        });

        it('shows counter of selected items when one item is selected', async () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const checkbox = screen.getByRole('checkbox', { name: `Select item ${data.items[0].name}` });
            await fireEvent.click(checkbox);
            await expect(screen.findByText('1 item selected')).resolves.toBeInTheDocument();
        });

        it('should mark select all checkbox as indeterminate when some items are selected', async () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const checkbox = screen.getByRole('checkbox', { name: `Select item ${data.items[0].name}` });
            await fireEvent.click(checkbox);
            await expect(screen.findByRole('checkbox', { name: 'Select all' })).resolves.toBeInTheDocument();
        });

        it('should mark select all checkbox as checked when all items are selected', async () => {
            render(Datagrid, {
                props: {
                    gridTitle,
                    filter: { search: '' },
                    avatar: false,
                    showHeader: true,
                    checkbox: true,
                    data,
                    columns,
                    currentPage: 1,
                    total: 2,
                    perPage: 10,
                },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const checkbox = screen.getByRole('checkbox', { name: `Select item ${data.items[0].name}` });
            await fireEvent.click(checkbox);

            const checkbox2 = screen.getByRole('checkbox', { name: `Select item ${data.items[1].name}` });
            await fireEvent.click(checkbox2);

            await expect(screen.findByRole('checkbox', { name: 'Select all' })).resolves.toBeChecked();
        });
    });

    describe('Filtering', () => {
        it('filters data when search input is filled', async () => {
            const { emitted } = render(Datagrid, {
                props: { gridTitle, filter: { search: '' }, data, columns, currentPage: 1, total: 2, perPage: 10 },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const searchInput = screen.getByPlaceholderText('Search');
            await fireEvent.update(searchInput, 'User 1');

            expect(emitted().input).toBeTruthy();
        });
    });

    describe('Sorting', () => {
        it.skip('sorts data when column header is clicked', async () => {
            render(Datagrid, {
                props: { gridTitle, filter: { search: '' }, data, columns, currentPage: 1, total: 2, perPage: 10 },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const idHeader = screen.getByText('ID');
            await fireEvent.click(idHeader);

            expect(screen.getByText('User 1')).toBeInTheDocument();
            expect(screen.queryByText('User 2')).not.toBeInTheDocument();
        });

        it.skip('shows sort indicator when column is sorted', async () => {
            render(Datagrid, {
                props: { gridTitle, filter: { search: '' }, data, columns, currentPage: 1, perPage: 10, total: 2 },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const idHeader = screen.getByText('ID');
            await fireEvent.click(idHeader);

            expect(screen.getByText('ID')).toHaveClass('sort');
        });

        it.skip('changes sort direction when column header is clicked', async () => {
            render(Datagrid, {
                props: { gridTitle, filter: { search: '' }, data, columns, currentPage: 1, perPage: 10, total: 2 },
                global: { mocks: { $t: mockT, $tc: mockT } },
            });

            const idHeader = screen.getByText('ID');
            await fireEvent.click(idHeader);
            await fireEvent.click(idHeader);

            expect(screen.getByText('User 2')).toBeInTheDocument();
            expect(screen.queryByText('User 1')).not.toBeInTheDocument();
        });
    });
});
