import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
    state: () => {
        return {
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            contact_name: '',
            contact_email: '',
            contact_phone: '',
            payment_method: '',
            payment_status: '',
            order_date: '',
            total_amount: 0,
        };
    },
});
