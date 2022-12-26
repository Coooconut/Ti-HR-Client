<template>
  <form :class="hiddenClass">
    <div class="mb-3">
      <label for="employee-code" class="form-label">員工編號</label>
      <input
        type="text"
        name="employee-code"
        class="form-control"
        id="employee-code"
        placeholder="Enter your employee code."
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">密碼</label>
      <input
        type="password"
        name="password"
        class="form-control"
        id="password"
        placeholder="Enter your password."
      />
    </div>
    <span>登入系統</span>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
import { mapState } from "pinia";
import useFormStore from "@/stores/form";

export default {
  name: "SignInForm",
  computed: {
    // 代入 store 以及 getters，如此兩者可在任意元件中使用
    ...mapState(useFormStore, ["hiddenClass"]),
  },
};
</script>
