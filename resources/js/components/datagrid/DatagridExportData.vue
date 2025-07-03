<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu';

defineEmits(['clicked']);
</script>

<template>
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <span @click="$emit('clicked', 'CSV')">Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem :as-child="true">
            <span @click="$emit('clicked', 'XLS')">Export as XLS</span>
        </DropdownMenuItem>
    </DropdownMenuGroup>
</template>
