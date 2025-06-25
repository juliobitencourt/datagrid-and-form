<script setup lang="ts">
import { Datagrid } from '@/components/ui/datagrid';
import { useResourceHandlers } from '@/composables/useResourceHandlers';
import AppLayout from '@/layouts/AppLayout.vue';
import ResourceLayout from '@/layouts/ResourceLayout.vue';
import { type BreadcrumbItem, type ResourceProps } from '@/types';
import { Head } from '@inertiajs/vue3';
import { Edit, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
    resource: ResourceProps;
    filters: {
        search: string;
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contacts',
        href: '/contacts',
    },
];

const { handleAction, handleBulkAction, handleExport, handleNavigation, handleSearch, handlePrimaryAction } = useResourceHandlers('contacts');

const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'E-mail' },
    { key: 'birth_date', label: 'Birthdate' },
    { key: 'visits', label: 'Visits' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
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
                    :filter="{ search: filters.search || '' }"
                    primary-action-title="New Contact"
                    :current-page="props.resource.current_page"
                    :per-page="props.resource.per_page"
                    :total="props.resource.total"
                    @bulk-action="handleBulkAction"
                    @action="handleAction"
                    @export-data="handleExport"
                    @search="handleSearch"
                    @primary-action="handlePrimaryAction"
                    @navigation="handleNavigation"
                />
            </div>
        </ResourceLayout>
    </AppLayout>
</template>
