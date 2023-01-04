<template>
  <h1>人資專區</h1>
  <!-- 出勤記錄表 -->
  <h3>出勤記錄表</h3>
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">流水編號</th>
        <th scope="col">日期</th>
        <th scope="col">員工編號</th>
        <th scope="col">姓名</th>
        <th scope="col">狀態</th>
        <th scope="col">上班打卡時間</th>
        <th scope="col">下班打卡時間</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(punch, index) in data" :key="punch.id">
        <td>{{ index + 1 }}</td>
        <td>{{ punch.workingDay }}</td>
        <td>{{ punch.Employee.code }}</td>
        <td>{{ punch.Employee.full_name }}</td>
        <td>{{ punch.state }}</td>
        <td>{{ punch.createdAt }}</td>
        <td>{{ punch.updatedAt }}</td>
      </tr>
    </tbody>
  </table>
  <button class="btn btn-primary" @click="getPunches">查閱打卡記錄</button>
  <!-- Pagination -->
  <div class="container">
    <paginate
      v-model="page"
      :page-count="page_sum"
      :page-range="20"
      :click-handler="getPunches"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
    ></paginate>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import { mapStores } from "pinia";
import useAuthStore from "../stores/auth";

export default {
  name: "PunchTable",
  components: {
    Paginate,
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useAuthStore),
  },
  props: [],
  data() {
    return {
      count: null,
      data: null,
      page: null,
      page_current: 1,
      page_sum: null,
    };
  },
  methods: {
    getPunches() {
      this.page_current = this.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.page_current,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.response = res;
          this.message = res.message;
          this.count = res.count;
          this.data = res.data;
          this.page_sum = Math.ceil(this.count / 10);
        });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
