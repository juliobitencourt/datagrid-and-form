<script setup lang="ts">
import { Button } from '@/components/ui/button';

import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination';

defineProps<{
    currentPage: number;
    total: number;
    perPage: number;
}>();
</script>

<template>
    <Pagination v-slot="{ page }" :items-per-page="perPage" :total="total" :sibling-count="1" show-edges>
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst @click="$emit('clicked', 1)" />
            <PaginationPrev @click="$emit('clicked', page - 1)" />

            <template v-for="(item, index) in items">
                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                    <Button @click="$emit('clicked', item.value)" class="h-10 w-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'">
                        {{ item.value }}
                    </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext @click="$emit('clicked', page + 1)" />
            <PaginationLast @click="$emit('clicked', total / perPage)" />
        </PaginationList>
    </Pagination>
</template>
