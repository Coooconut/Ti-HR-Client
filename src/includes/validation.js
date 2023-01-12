// 從 vee-validate 引用 component ，並設定別名，避免和 HTML 混淆。
import {
  configure,
  defineRule,
  ErrorMessage,
  Form as VeeForm,
  Field as VeeField,
} from "vee-validate";
import { max, min, regex, required } from "@vee-validate/rules";

export default {
  // 引數 app 表示將插件安在指定的 .vue 檔案
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    // 引數一表示驗證規則的名稱，可自訂別名。引數二表示使用 @vee-validate/rules 套件中的那個驗證規則。
    // 規則一覽：https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules
    defineRule("regex", regex);
    defineRule("required", required);
    defineRule("max", max);
    defineRule("min", min);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          regex: `這個欄位必須是T開頭，外加七個數字。`,
          required: `這個欄位是必填`,
          max: `這個欄位頂多只有八個字元`,
          min: `這個欄位至少要有四個字元`,
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `這個欄位不符合規定`;

        return message;
      },
    });
  },
};
