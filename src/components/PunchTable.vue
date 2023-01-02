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
</template>

<script>
export default {
  name: "PunchTable",
  props: ["count", "data", "page_current", "page_sum"],
  data() {
    return {
      page: null,
    };
  },
};
</script>
