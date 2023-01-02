<template>
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
  <!-- Pagination -->
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>
      <li class="page-item" v-for="number in page_sum" :key="number.index">
        <button class="page-link" :page="page">{{ number }}</button>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&gt;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "PunchTable",
  props: ["count", "data", "page_current", "page_sum"],
  emits: ["emit-change-page"],
  data() {
    return {
      page: null,
    };
  },
  methods: {
    changePage() {
      this.$emit("emit-change-page", this.number.index);
    },
  },
};
</script>
