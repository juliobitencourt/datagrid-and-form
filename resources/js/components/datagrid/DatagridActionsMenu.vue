<script setup lang="ts">
import { type Action } from '@/components/ui/datagrid/Datagrid.vue';
import { DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Props {
    item: any;
    actions: Action[];
}

defineProps<Props>();
defineEmits(['clicked']);
</script>

<template>
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true" v-for="action in actions" :key="action.label">
            <span
                class="w-full cursor-pointer text-left text-xs"
                :class="action.destructive ? 'text-destructive hover:text-destructive' : 'text-foreground'"
                @click="$emit('clicked', action, item)"
            >
                <component
                    v-if="action.icon"
                    :is="action.icon"
                    class="h-5 w-5"
                    :class="action.destructive ? 'text-destructive hover:text-destructive' : 'text-foreground'"
                />
                {{ action.label }}
            </span>
        </DropdownMenuItem>
    </DropdownMenuGroup>
</template>
