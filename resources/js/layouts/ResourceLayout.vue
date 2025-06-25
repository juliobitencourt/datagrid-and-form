<script setup lang="ts">
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/vue3';
import { Plus } from 'lucide-vue-next';

interface Props {
    title: string;
    description?: string;
}

defineProps<Props>();

const navItems = null;
</script>

<template>
    <div class="px-4 py-6">
        <Heading :title="title" :description="description" />

        <div class="flex flex-col space-y-8 md:space-y-0 lg:space-y-0">
            <aside v-if="navItems" class="mb-4 w-full max-w-xl lg:w-48">
                <nav class="flex space-x-1">
                    <Button
                        v-for="item in navItems"
                        :key="item.href"
                        variant="ghost"
                        :class="['justify-start', { 'bg-muted': currentPath === item.href }]"
                        as-child
                    >
                        <Link :href="item.href">
                            {{ item.title }}
                        </Link>
                    </Button>
                    <Button variant="ghost" class="cursor-pointer justify-start" title="Add View">
                        <Plus />
                    </Button>
                </nav>
            </aside>

            <Separator class="my-6 md:hidden" />

            <div class="flex-1">
                <section class="space-y-12">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
