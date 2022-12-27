<template>
  <vee-form
    :class="hiddenClassSignInForm"
    v-bind:validation-schema="schema"
    v-on:submit="signIn"
  >
    <!-- 員工編號 -->
    <div class="mb-3">
      <label for="employee_code" class="form-label">員工編號</label>
      <vee-field
        type="text"
        name="employee_code"
        class="form-control"
        id="employee_code"
        placeholder="Enter your employee code."
      />
      <ErrorMessage class="form-validate-error" name="employee_code" />
    </div>
    <!-- 密碼 -->
    <div class="mb-3">
      <label for="password" class="form-label">密碼</label>
      <vee-field
        type="password"
        name="password"
        class="form-control"
        id="password"
        placeholder="Enter your password."
      />
      <ErrorMessage class="form-validate-error" name="password" />
    </div>
    <span>登入系統</span>
    <button type="submit" class="btn btn-primary">Submit</button>
  </vee-form>
</template>

<script>
import { mapState, mapStores } from "pinia";
import useFormStore from "@/stores/form";

export default {
  name: "SignInForm",
  props: ["response"],
  data() {
    return {
      // 資料驗證的 schema
      schema: {
        employee_code: "required|length:8",
        password: "required",
      },
    };
  },
  emits: ["emit-sign-in"],
  methods: {
    signIn(values) {
      fetch("http://localhost:8000/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `employeeCode=${values.employee_code}&password=${values.password}`,
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.$emit("emit-sign-in", res);
          this.formStore.isOpenSignInForm = !this.formStore.isOpenSignInForm;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useFormStore),
    // 代入 store 以及 getters，如此兩者可在任意元件中使用
    ...mapState(useFormStore, ["hiddenClassSignInForm"]),
  },
};
</script>
