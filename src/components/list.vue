<script lang="ts" setup>
import { computed, ref, type PropType, customRef } from "vue";

const debounceRef = (value: string, delay = 300) => {
  let timeout: number;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: string) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
};

type ListItem = {
  name: string;
  [key: string]: any;
};
const props = defineProps({
  data: {
    type: Array as PropType<ListItem[]>,
    default: () => [],
  },
});
const key = debounceRef("");
const list = computed(() => {
  if (key.value) {
    return props.data.filter((item) => item.name.includes(key.value));
  }
  return props.data;
});
</script>

<template>
  <div class="ListBody">
    <header>
      <var-input
        v-model="key"
        placeholder="Search..."
        variant="outlined"
        size="small"
      >
        <template #prepend-icon>
          <Icon
            style="font-size: 0.7em; margin-right: 0.5em"
            icon="solar:magnifer-broken"
          />
        </template>
      </var-input>
    </header>
    <main @click="key = ''">
      <template v-for="(item, index) in list">
        <slot
          v-if="$slots.default"
          :data="item"
          :index="index"
        ></slot>
        <span v-else>{{ item.name }}</span>
      </template>
    </main>
  </div>
</template>

<style lang="less" scoped>
.ListBody {
  padding: 1em 0;
  main {
    margin-top: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow: scroll;
  }
}
</style>
