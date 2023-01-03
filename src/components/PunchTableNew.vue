<template>
  <h1>This is Punch Table New</h1>
  <!-- Table -->
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
  <paginate
    v-model="page"
    :page-count="page_sum"
    :page-range="20"
    :click-handler="getPunches"
    :prev-text="'Prev'"
    :next-text="'Next'"
    :container-class="'pagination'"
  ></paginate>
</template>

<script>
import Paginate from "vuejs-paginate-next";

export default {
  name: "PunchTableNew",
  components: {
    Paginate,
  },
  props: ["count", "data", "page_current", "page_sum", "token"],
  data() {
    return {
      count_new: null,
      data_new: null,
      page: null,
      page_current_new: null,
      page_sum_new: null,
    };
  },
  methods: {
    getPunches() {
      this.page_current_new = this.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.page_current,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.response = res;
          this.message = res.message;
          this.count_new = res.count;
          this.data_new = res.data;
          this.page_sum = Math.ceil(this.count / 10);
        });
    },
  },
};
</script>
