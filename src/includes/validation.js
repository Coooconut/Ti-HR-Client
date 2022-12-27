// 從 vee-validate 引用 component ，並設定別名，避免和 HTML 混淆。
import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
} from "vee-validate";
import { required } from "@vee-validate/rules";

export default {
  // 引數 app 表示將插件安在指定的 .vue 檔案
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    // 引數一表示驗證規則的名稱，可自訂別名。引數二表示使用 @vee-validate/rules 套件中的那個驗證規則。
    defineRule("required", required);
  },
};
