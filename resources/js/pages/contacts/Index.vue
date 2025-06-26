<script setup lang="ts">
import { Datagrid } from '@/components/ui/datagrid';
import { useResourceHandlers } from '@/composables/useResourceHandlers';
import AppLayout from '@/layouts/AppLayout.vue';
import ResourceLayout from '@/layouts/ResourceLayout.vue';
import { useContactsStore } from '@/stores/contacts';
import { type BreadcrumbItem, type ResourceProps } from '@/types';
import { Head } from '@inertiajs/vue3';
import { Edit, Trash2 } from 'lucide-vue-next';

const contactsStore = useContactsStore();

const props = defineProps<{
    resource: ResourceProps;
    filter: {
        search: string;
        sort: [
            {
                field: string;
                direction: string;
            },
        ];
    };
}>();

contactsStore.filter = props.filter;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contacts',
        href: '/contacts',
    },
];

const { handleAction, handleBulkAction, handleExport, handleNavigation, handleSearch, handleSorting, handlePrimaryAction } =
    useResourceHandlers('contacts');

const columns = [
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    { key: 'birth_date', label: 'Birthdate', sortable: true, sort_direction: 'desc' as const },
    { key: 'visits', label: 'Visits', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true },
    { key: 'updated_at', label: 'Updated At', sortable: true },
];

const actions = [
    { label: 'Edit', icon: Edit },
    { label: 'Delete', destructive: true, icon: Trash2 },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="'Contacts'" />
        <ResourceLayout :title="'Contacts'" :description="`${'Manage your'} ${'Contacts'.toLowerCase()}`">
            <div class="flex flex-col">
                <Datagrid
                    grid-title="Contacts"
                    :show-header="true"
                    :checkbox="true"
                    :avatar="true"
                    :data="{ items: props.resource.data }"
                    :columns="columns"
                    :actions="actions"
                    primary-action-title="New Contact"
                    :current-page="props.resource.current_page"
                    :per-page="props.resource.per_page"
                    :total="props.resource.total"
                    @bulk-action="handleBulkAction"
                    @action="handleAction"
                    @export-data="handleExport"
                    @search="handleSearch"
                    @sort="handleSorting"
                    @primary-action="handlePrimaryAction"
                    @navigation="handleNavigation"
                />
            </div>
        </ResourceLayout>
    </AppLayout>
</template>
