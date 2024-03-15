<script lang="ts" setup>
import { computed, ref, type PropType } from "vue";

type ListItem = {
  name: string;
};
const props = defineProps({
  data: {
    type: Array as PropType<ListItem[]>,
    required: true,
  },
});
const key = ref("");
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
      >
        <template #prepend-icon>
          <Icon icon="solar:magnifer-broken" />
        </template>
      </var-input>
    </header>
    <main>
      <template v-for="(item, index) in list">
        <slot> </slot>
      </template>
    </main>
  </div>
</template>

<style lang="less" scoped>
.ListBody {
}
</style>
