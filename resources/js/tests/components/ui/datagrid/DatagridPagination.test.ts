import { DatagridPagination } from '@/components/datagrid';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';

describe('DatagridPagination.vue', () => {
    it('emits vue event when navigates', async () => {
        const { emitted } = render(DatagridPagination, {
            props: {
                currentPage: 1,
                total: 100,
                perPage: 10,
            },
        });

        const page2 = screen.getByRole('button', { name: 'Page 2' });
        await fireEvent.click(page2);

        const previousPage = screen.getByRole('button', { name: 'Previous Page' });
        await fireEvent.click(previousPage);

        const nextPage = screen.getByRole('button', { name: 'Next Page' });
        await fireEvent.click(nextPage);

        const lastPage = screen.getByRole('button', { name: 'Last Page' });
        await fireEvent.click(lastPage);

        const firstPage = screen.getByRole('button', { name: 'First Page' });
        await fireEvent.click(firstPage);

        expect(emitted().clicked[0]).toEqual([2]);
        expect(emitted().clicked[1]).toEqual([1]);
        expect(emitted().clicked[2]).toEqual([2]);
        expect(emitted().clicked[3]).toEqual([10]);
        expect(emitted().clicked[4]).toEqual([1]);
    });
});
