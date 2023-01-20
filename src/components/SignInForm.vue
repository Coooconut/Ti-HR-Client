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
        autocomplete="off"
      />
      <ErrorMessage class="form-validate-error" name="password" />
    </div>
    <button type="submit" class="btn btn-primary mb-3">登入系統 Submit</button>
  </vee-form>
</template>

<script setup>
import useAuthStore from "@/stores/auth";

const auth = useAuthStore();

// 資料驗證的 schema
const schema = {
  employee_code: "required|max:8|min:4",
  password: "required",
};
// 使用者可以登入系統
function signIn(values) {
  fetch(`${import.meta.env.VITE_BASE_URL}/api/signIn`, {
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
      auth.signIn(res);
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
