import { Action } from '@/components/ui/datagrid/Datagrid.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { router } from '@inertiajs/vue3';
import axios from 'axios';
import { ref } from 'vue';

export function useResourceHandlers(routeName: string, form?: any) {
    const openSheet = ref(false);
    const openAlertDialog = ref(false);
    const alertDialogCustomAction = ref(() => {});
    const { toast } = useToast();

    const handleAction = (action: Action, item: any) => {
        console.log(action);
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

    const handleNavigation = (to: string, search: string) => {
        router.get(
            route(routeName + '.index'),
            { page: to, search },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearch = (term: string) => {
        router.get(
            route(routeName + '.index'),
            { search: term },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
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
        handlePrimaryAction,
        handleSubmit,
        toggleField,
    };
}
