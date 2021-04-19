import Vue from "vue";
export const EventBus = new Vue();
EventBus.installQueueChanged = "installQueueChanged";
EventBus.$installQueue = [];
EventBus.$on(
  EventBus.installQueueChanged,
  (installQueue) => (EventBus.$installQueue = installQueue)
);
