<template>
  <form>
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
export default {
  name: "SignInForm",
};
</script>
