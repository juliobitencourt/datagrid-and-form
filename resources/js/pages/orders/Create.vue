<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/AppLayout.vue';
import ResourceLayout from '@/layouts/ResourceLayout.vue';
import { useOrderStore } from '@/stores/order';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/vue3';
import { BookUser, CreditCard, User } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { z, ZodError } from 'zod';

const orderStore = useOrderStore();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/orders',
    },
];

const addressSchema = z.object({
    address_line_1: z.string().min(1, 'Address line 1 is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
});

const contactSchema = z.object({
    contact_name: z.string().min(1, 'Contact name is required'),
    contact_email: z.string().email('Invalid email address'),
    contact_phone: z.string().min(1, 'Contact phone is required'),
});

const paymentSchema = z.object({
    payment_method: z.enum(['Credit Card', 'PayPal', 'Bank Transfer']),
    payment_status: z.enum(['Unpaid', 'Paid', 'Refunded']),
    order_date: z.string().min(1, 'Order date is required'),
    total_amount: z.number().min(0, 'Total amount must be a positive number'),
});

const orderData = orderStore;
const stepIndex = ref(1);
const errors = ref<Record<string, string>>({});

const steps = [
    {
        step: 1,
        title: 'Address',
        description: 'Add your address here',
        icon: BookUser,
    },
    {
        step: 2,
        title: 'Contact',
        description: 'Add your contact information',
        icon: User,
    },
    {
        step: 3,
        title: 'Payment',
        description: 'Add any payment information you have',
        icon: CreditCard,
    },
];

const isPrevDisabled = computed(() => stepIndex.value === 1);
const isNextDisabled = ref(false);
const meta = {
    valid: true,
};

const nextStep = () => {
    // Validate the current step before proceeding
    if (stepIndex.value === 1) {
        // Validate address form
        const addressData = {
            address_line_1: orderData.address_line_1,
            city: orderData.city,
            state: orderData.state,
            postal_code: orderData.postal_code,
            country: orderData.country,
        };
        errors.value = {}; // Reset errors
        const result = addressSchema.safeParse(addressData);
        if (!result.success) {
            errors.value = formatZodErrors(result.error);
            return;
        }
    } else if (stepIndex.value === 2) {
        // Validate contact form
        const contactData = {
            contact_name: orderData.contact_name,
            contact_email: orderData.contact_email,
            contact_phone: orderData.contact_phone,
        };
        errors.value = {}; // Reset errors
        const result = contactSchema.safeParse(contactData);
        if (!result.success) {
            errors.value = formatZodErrors(result.error);
            return;
        }
    } else if (stepIndex.value === 3) {
        // Validate payment form
        const paymentData = {
            payment_method: orderData.payment_method,
            payment_status: orderData.payment_status,
            order_date: orderData.order_date,
            total_amount: orderData.total_amount,
        };
        errors.value = {}; // Reset errors
        const result = paymentSchema.safeParse(paymentData);
        if (!result.success) {
            errors.value = formatZodErrors(result.error);
            return;
        }
    }

    if (stepIndex.value < steps.length) {
        stepIndex.value++;
    }
};

const prevStep = () => {
    if (stepIndex.value > 1) {
        stepIndex.value--;
    }
};

function formatZodErrors(error: ZodError) {
    const formatted: Record<string, string> = {};

    error.errors.forEach((err) => {
        if (err.path.length > 0) {
            const key = err.path.join('.');
            formatted[key] = err.message;
        }
    });

    return formatted;
}

const handleSubmit = () => {
    if (stepIndex.value !== steps.length) {
        return; // Prevent submission if not on the last step
    }

    // Final validation for all data
    const addressData = {
        address_line_1: orderData.address_line_1,
        city: orderData.city,
        state: orderData.state,
        postal_code: orderData.postal_code,
        country: orderData.country,
    };
    const contactData = {
        contact_name: orderData.contact_name,
        contact_email: orderData.contact_email,
        contact_phone: orderData.contact_phone,
    };
    const paymentData = {
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status,
        order_date: orderData.order_date,
        total_amount: orderData.total_amount,
    };

    errors.value = {}; // Reset errors

    const addressResult = addressSchema.safeParse(addressData);
    const contactResult = contactSchema.safeParse(contactData);
    const paymentResult = paymentSchema.safeParse(paymentData);

    if (!addressResult.success || !contactResult.success || !paymentResult.success) {
        errors.value = {
            ...(!addressResult.success ? formatZodErrors(addressResult.error as ZodError) : {}),
            ...(!contactResult.success ? formatZodErrors(contactResult.error as ZodError) : {}),
            ...(!paymentResult.success ? formatZodErrors(paymentResult.error as ZodError) : {}),
        };
        return;
    }

    router.post(
        '/orders',
        {
            address_line_1: orderData.address_line_1,
            address_line_2: orderData.address_line_2,
            city: orderData.city,
            state: orderData.state,
            postal_code: orderData.postal_code,
            country: orderData.country,
            contact_name: orderData.contact_name,
            contact_email: orderData.contact_email,
            contact_phone: orderData.contact_phone,
            payment_method: orderData.payment_method,
            payment_status: orderData.payment_status,
            order_date: orderData.order_date,
            total_amount: orderData.total_amount,
        },
        {
            onSuccess: () => {
                // Reset form data after successful submission
                orderStore.$reset();
                stepIndex.value = 1; // Reset to the first step
            },
            onError: (error) => {
                errors.value = error;
                const errorMessages = Object.values(error);
                toast({
                    title: 'Error',
                    description: errorMessages.join(' - '),
                    variant: 'destructive',
                });
            },
        },
    );
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="'Orders'" />
        <ResourceLayout :title="'Orders'" :description="`${'Manage your'} ${'Orders'.toLowerCase()}`">
            <div class="flex flex-col">
                <div v-if="$page.props.flash.message" class="mb-4 rounded bg-green-100 p-4 text-green-800">
                    {{ $page.props.flash.message }}
                </div>
                <form class="max-w-6xl" @submit.prevent="handleSubmit">
                    <Stepper v-model="stepIndex" class="mx-auto">
                        <StepperItem v-for="item in steps" :key="item.step" class="w-full" :step="item.step">
                            <StepperTrigger>
                                <StepperIndicator>
                                    <component :is="item.icon" class="h-4 w-4" />
                                </StepperIndicator>
                                <div class="flex flex-col">
                                    <StepperTitle>
                                        {{ item.title }}
                                    </StepperTitle>
                                    <StepperDescription>
                                        {{ item.description }}
                                    </StepperDescription>
                                </div>
                            </StepperTrigger>
                            <StepperSeparator v-if="item.step !== steps[steps.length - 1].step" class="h-px w-full" />
                        </StepperItem>
                    </Stepper>

                    <div v-if="stepIndex === 1" class="mt-4">
                        <h2 class="text-md mb-3 font-semibold">Address Form</h2>
                        <div class="mb-4">
                            <Input type="text" v-model="orderData.address_line_1" placeholder="Address Line 1" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.address_line_1">{{ errors.address_line_1 }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.address_line_2" placeholder="Address Line 2" class="input input-bordered w-full" />
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.city" placeholder="City" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.city">{{ errors.city }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.state" placeholder="State" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.state">{{ errors.state }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.postal_code" placeholder="Postal" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.postal_code">{{ errors.postal_code }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.country" placeholder="Country" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.country">{{ errors.country }}</span>
                        </div>
                    </div>

                    <div v-else-if="stepIndex === 2" class="mt-4">
                        <h2 class="text-md mb-3 font-semibold">Contact Form</h2>
                        <div class="mb-4">
                            <Input type="text" v-model="orderData.contact_name" placeholder="Name" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.contact_name">{{ errors.contact_name }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.contact_email" placeholder="Email" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.contact_email">{{ errors.contact_email }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="text" v-model="orderData.contact_phone" placeholder="Phone" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.contact_phone">{{ errors.contact_phone }}</span>
                        </div>
                    </div>

                    <div v-else-if="stepIndex === 3" class="mt-4">
                        <h2 class="text-md mb-3 font-semibold">Payment Form</h2>
                        <div class="mb-4">
                            <Select name="method" id="method" v-model="orderData.payment_method" tabindex="2">
                                <SelectTrigger class="w-[240px]">
                                    <SelectValue placeholder="Select Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select Payment Method</SelectLabel>
                                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                                        <SelectItem value="PayPal">PayPal</SelectItem>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <span class="text-sm text-red-700" v-if="errors.payment_method">{{ errors.payment_method }}</span>
                        </div>

                        <div class="mb-4">
                            <Select name="method" id="method" v-model="orderData.payment_status" tabindex="2">
                                <SelectTrigger class="w-[240px]">
                                    <SelectValue placeholder="Select Payment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select Payment Status</SelectLabel>
                                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Refunded">Refunded</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <span class="text-sm text-red-700" v-if="errors.payment_status">{{ errors.payment_status }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="date" v-model="orderData.order_date" placeholder="Order Date" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.order_date">{{ errors.order_date }}</span>
                        </div>

                        <div class="mb-4">
                            <Input type="number" v-model="orderData.total_amount" placeholder="Total Amount" class="input input-bordered w-full" />
                            <span class="text-sm text-red-700" v-if="errors.total_amount">{{ errors.total_amount }}</span>
                        </div>
                    </div>

                    <div class="mt-4 flex items-center justify-between">
                        <Button :disabled="isPrevDisabled" variant="outline" size="sm" @click.prevent="prevStep()"> Back </Button>
                        <div class="flex items-center gap-3">
                            <Button
                                v-if="stepIndex !== 3"
                                :type="meta.valid ? 'button' : 'submit'"
                                :disabled="isNextDisabled"
                                size="sm"
                                @click="meta.valid && nextStep()"
                            >
                                Next
                            </Button>
                            <Button v-if="stepIndex === 3" size="sm" type="submit"> Submit </Button>
                        </div>
                    </div>
                </form>
            </div>
        </ResourceLayout>
    </AppLayout>
</template>
