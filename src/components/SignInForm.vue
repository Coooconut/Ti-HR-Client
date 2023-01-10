<template>
  <vee-form class="mt-5" v-bind:validation-schema="schema" v-on:submit="signIn">
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
    <button type="submit" class="btn btn-primary mb-3">登入系統 Submit</button>
  </vee-form>
</template>

<script>
import { createToaster } from "@meforma/vue-toaster";

const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 8000,
});

export default {
  name: "SignInForm",
  data() {
    return {
      // 資料驗證的 schema
      schema: {
        employee_code: "required|max:8|min:4",
        password: "required",
      },
    };
  },
  emits: ["emit-sign-in"],
  methods: {
    signIn(values) {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/signin`, {
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
          toasterInfo.show(res.message);
          this.$emit("emit-sign-in", res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
