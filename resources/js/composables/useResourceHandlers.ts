import { Action } from '@/components/ui/datagrid/Datagrid.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { useContactsStore } from '@/stores/contacts';
import { router } from '@inertiajs/vue3';
import axios from 'axios';
import { ref } from 'vue';

export function useResourceHandlers(routeName: string, form?: any) {
    const contactsStore = useContactsStore();
    const openSheet = ref(false);
    const openAlertDialog = ref(false);
    const alertDialogCustomAction = ref(() => {});
    const { toast } = useToast();

    interface Column {
        key: string;
        label: string;
        sortable?: boolean;
        sort_direction?: 'asc' | 'desc';
    }

    const handleAction = (action: Action, item: any) => {
        if (action.destructive) {
            openAlertDialog.value = true;
            alertDialogCustomAction.value = () => {
                router.delete(route(routeName + '.destroy', item.id), {
                    onSuccess: () => {
                        openAlertDialog.value = false;
                    },
                    onError: () => {
                        openAlertDialog.value = false;
                        toast({
                            title: 'Action',
                            description: 'Failed to delete item',
                        });
                    },
                });
            };
        } else if (action == 'Clicked' || action.label == 'Editar' || action.label == 'Edit') {
            // TODO: Check if the action is a custom action
            // https://github.com/dilli-studio/app.dilli.studio/issues/20
            if (routeName == 'automations' && action == 'Clicked') {
                router.visit(route(routeName + '.inbox', item.id), { preserveScroll: true });
            } else {
                router.visit(route(routeName + '.edit', item.id));
            }
        }
    };

    const handleBulkAction = (action: Action, items: any[]) => {
        if (action.destructive) {
            openAlertDialog.value = true;
            alertDialogCustomAction.value = () => {
                router.delete(route(routeName + '.bulk-delete'), {
                    data: { ids: items.map((item: any) => item.id) },
                    onSuccess: () => {
                        openAlertDialog.value = false;
                    },
                    onError: () => {
                        openAlertDialog.value = false;
                        toast({
                            title: 'Bulk Action',
                            description: 'Failed to delete items',
                        });
                    },
                });
            };
        } else {
            toast({
                title: `Action: ${action}`,
                description: JSON.stringify(items),
            });
        }
    };

    const handleExport = (format: string, items: any[]) => {
        toast({
            title: `Export Data: ${format}`,
            description: JSON.stringify(items),
        });
    };

    const handleNavigation = (to: string) => {
        router.get(
            route(routeName + '.index'),
            {
                page: to,
                search: contactsStore.filter.search,
                sort: `${contactsStore.filter.sort[0].field}:${contactsStore.filter.sort[0].direction}`,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearch = (term: string) => {
        contactsStore.filter.search = term;
        router.get(
            route(routeName + '.index'),
            { search: term, sort: `${contactsStore.filter.sort[0].field}:${contactsStore.filter.sort[0].direction}` },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSorting = (column: Column) => {
        console.log('Sorting by:', column);
        if (column.sortable) {
            console.log(`Sorting by column: ${column.key} (${column.label}) - sortable: ${column.sortable}) ${column.sort_direction}`);
            column.sort_direction = column.sort_direction == 'asc' ? 'desc' : 'asc';
            console.log(`Sorting by column: ${column.key} (${column.label}) - sortable: ${column.sortable}) ${column.sort_direction}`);
            contactsStore.filter.sort = [
                {
                    field: column.key,
                    direction: column.sort_direction || 'asc',
                },
            ];
            router.get(
                route('contacts.index'),
                { search: contactsStore.filter.search, sort: `${contactsStore.filter.sort[0].field}:${contactsStore.filter.sort[0].direction}` },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    };

    const handlePrimaryAction = () => {
        openSheet.value = true;
    };

    const handleSubmit = () => {
        // Force form processing state to true to
        // prevent triggering the block navigation
        form.processing = true;
        if (form.id) {
            form.put(route(routeName + '.update', form.id), {
                onSuccess: () => {
                    openSheet.value = false;
                    form.reset();
                },
                onError: () => {
                    // Handle error case
                },
            });
        } else {
            form.post(route(routeName + '.store'), {
                onSuccess: () => {
                    openSheet.value = false;
                    form.reset();
                },
                onError: () => {
                    // Handle error case
                },
            });
        }
    };

    const toggleField = (item: any, field: string) => {
        return axios.patch(route(routeName + '.toggle-field', item), {
            field: field,
        });
    };

    return {
        openSheet,
        openAlertDialog,
        alertDialogCustomAction,
        handleAction,
        handleBulkAction,
        handleExport,
        handleNavigation,
        handleSearch,
        handleSorting,
        handlePrimaryAction,
        handleSubmit,
        toggleField,
    };
}
