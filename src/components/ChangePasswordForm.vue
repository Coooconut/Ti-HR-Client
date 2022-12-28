<template>
  <vee-form
    :class="hiddenClassChangePasswordForm"
    v-bind:validation-schema="schema"
    v-on:submit="changPassword"
  >
    <!-- 舊密碼 -->
    <div class="mb-3">
      <label for="password" class="form-label">舊密碼</label>
      <vee-field
        type="password"
        name="password"
        class="form-control"
        id="password"
        placeholder="Enter your employee code."
      />
      <ErrorMessage class="form-validate-error" name="password" />
    </div>
    <!-- 新密碼 -->
    <div class="mb-3">
      <label for="new_password" class="form-label">新密碼</label>
      <vee-field
        type="password"
        name="new_password"
        class="form-control"
        id="new_password"
        placeholder="Enter your password."
      />
      <ErrorMessage class="form-validate-error" name="new_password" />
    </div>
    <!-- 確認新密碼 -->
    <div class="mb-3">
      <label for="new_password_confirm" class="form-label">確認新密碼</label>
      <vee-field
        type="password"
        name="new_password_confirm"
        class="form-control"
        id="new_password_confirm"
        placeholder="Enter your password."
      />
      <ErrorMessage class="form-validate-error" name="new_password_confirm" />
    </div>
    <span>更改密碼</span>
    <button type="submit" class="btn btn-primary">Submit</button>
  </vee-form>
</template>

<script>
import { mapState, mapStores } from "pinia";
import useFormStore from "@/stores/form";

export default {
  name: "ChangPasswordForm",
  props: ["response", "token"],
  data() {
    return {
      // 資料驗證的 schema
      schema: {
        password: "required",
        new_password: "required",
        new_password_confirm: "required",
      },
    };
  },
  emits: ["emit-change-password"],
  methods: {
    changPassword(values) {
      fetch("http://localhost:8000/api/employees/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Authorization: `Bearer ${this.token}`,
        },
        body: `password=${values.password}&newPassword=${values.new_password}&newPasswordConfirm=${values.new_password_confirm}`,
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.$emit("emit-change-password", res);
          this.formStore.isOpenChangePasswordForm =
            !this.formStore.isOpenChangePasswordForm;
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
    ...mapState(useFormStore, ["hiddenClassChangePasswordForm"]),
  },
};
</script>
