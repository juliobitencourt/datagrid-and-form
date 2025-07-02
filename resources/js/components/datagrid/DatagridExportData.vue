<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/vue3';

defineEmits(['clicked']);
</script>

<template>
    <DropdownMenuGroup>
        <DropdownMenuItem
            :as-child="true"
        >
            <span
                @click="$emit('clicked', 'CSV')"
            >
                {{ $t('Export as') }} CSV
            </span>
        </DropdownMenuItem>
        <DropdownMenuItem
            :as-child="true"
        >
            <span
                @click="$emit('clicked', 'XLS')"
            >
                {{ $t('Export as') }} XLS
            </span>
        </DropdownMenuItem>
    </DropdownMenuGroup>
</template>
