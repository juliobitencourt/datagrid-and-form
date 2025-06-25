<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CircleX, Plus, SlidersHorizontal, Trash2 } from 'lucide-vue-next';
import { PopoverClose } from 'reka-ui';
import { reactive, ref } from 'vue';

interface Field {
    name: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date';
}

interface Filter {
    field: string;
    operator: string;
    value: string | number | boolean;
}

const props = defineProps<{ fields: Field[] }>();
const emit = defineEmits<{
    (event: 'apply-filters', filters: Filter[]): void;
}>();

const filters = ref<Filter[]>([]);
const newFilter = reactive<Filter>({ field: '', operator: '', value: '' });

const operators: Record<string, string[]> = {
    string: ['=', '!=', 'contains', 'starts_with', 'ends_with'],
    number: ['=', '!=', '>', '<', '>=', '<='],
    boolean: ['=', '!='],
    date: ['=', '!=', '>', '<', '>=', '<='],
};

const getOperators = (field: string): string[] => {
    const type = props.fields.find((f) => f.name === field)?.type || 'string';
    return operators[type] || operators.string;
};

const addFilter = (): void => {
    if (newFilter.field && newFilter.operator && newFilter.value !== '') {
        filters.value.push({ ...newFilter });
        newFilter.field = '';
        newFilter.operator = '';
        newFilter.value = '';
    }
};

const removeFilter = (index: number): void => {
    filters.value.splice(index, 1);
};

const applyFilters = (): void => {
    emit('apply-filters', filters.value);
};
</script>

<template>
    <Popover v-model:open="openPopover">
        <PopoverTrigger as-child>
            <Button variant="outline" @click="$emit('export-data', 'csv')">
                <SlidersHorizontal />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="mr-6 w-fit">
            <PopoverClose class="flex place-self-end">
                <Button variant="ghost"><CircleX /></Button>
            </PopoverClose>
            <div class="p-2 text-sm">
                <div v-for="(filter, index) in filters" :key="index" class="mb-2">
                    <div class="flex items-center justify-between gap-2 rounded bg-neutral-100 px-2 dark:bg-neutral-800">
                        <span>{{ filter.field }} {{ filter.operator }} {{ filter.value }}</span>
                        <Button @click="removeFilter(index)" variant="ghost">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div class="mb-2 flex gap-2">
                    <select v-model="newFilter.field">
                        <option value="" disabled>{{ $t('Field') }}</option>
                        <option v-for="field in props.fields" :key="field.name" :value="field.name">{{ field.label }}</option>
                    </select>

                    <select v-model="newFilter.operator" :disabled="!newFilter.field">
                        <option value="" disabled>{{ $t('Operator') }}</option>
                        <option v-for="op in getOperators(newFilter.field)" :key="op" :value="op">{{ op }}</option>
                    </select>

                    <Input v-model="newFilter.value" :disabled="!newFilter.operator" :placeholder="$t('Enter value')" />
                    <Button @click="addFilter" :disabled="!newFilter.value" variant="outline">
                        <Plus class="h-4 w-4" />
                    </Button>
                </div>

                <Button @click="applyFilters">{{ $t('Submit') }}</Button>
            </div>
        </PopoverContent>
    </Popover>
</template>
