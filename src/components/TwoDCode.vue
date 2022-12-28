<template>
  <img
    :src="two_d_code"
    alt="打卡二維碼（先登入系統才可取得二維碼）"
    :class="hiddenClass2dCode"
  />
</template>

<script>
// 利用 mapStores 插件將 store 融入元件
import { mapState, mapStores } from "pinia";
import useFormStore from "@/stores/form";

export default {
  name: "TwoDCode",
  props: ["two_d_code"],
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useFormStore),
    // 代入 store 以及 getters，如此兩者可在任意元件中使用
    ...mapState(useFormStore, ["hiddenClass2dCode"]),
  },
};
</script>
