import { defineStore } from 'pinia'

export const useContactsStore = defineStore('contacts', {
  state: () => {
    return {
        filter: {
            search: '',
            sort: [
                { field: 'created_at', direction: 'desc' },
            ]
        }
    }
  }
});
