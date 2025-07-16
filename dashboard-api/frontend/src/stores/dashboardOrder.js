import { defineStore } from 'pinia';

export const useDashboardOrderStore = defineStore('dashboardOrder', {
  state: () => ({
    order: []
  }),
  actions: {
    save(order) {
      this.order = order;
      localStorage.setItem('dashboardOrder', JSON.stringify(order));
    },
    restore(defaultOrder = []) {
      const saved = localStorage.getItem('dashboardOrder');
      if (saved) {
        try {
          this.order = JSON.parse(saved);
        } catch {
          this.order = defaultOrder;
        }
      } else {
        this.order = defaultOrder;
      }
      return this.order;
    },
    reset(defaultOrder = []) {
      localStorage.removeItem('dashboardOrder');
      this.order = defaultOrder;
    }
  }
});
