"use strict";
const Editor = require("./editor");
// const Vue = require("vue"); // подключен в html
const axios = require("axios");
const UIkit = require("uikit");

window.editor = new Editor();
new Vue({
  el: "#app",
  data: {
    page: "index.html",
    showLoader: false,
    pageList: [],
    backupList: [],
  },
  methods: {
    onBtnSave() {
      this.showLoader = true;
      window.editor.save(
        () => {
          this.loadBackupList();
          this.showLoader = false;
          UIkit.notification({message: 'Успешно сохранено!', status: 'success'});
        },
        () => {
          this.showLoader = false;
          UIkit.notification({message: 'Ошибка сохранеия!', status: 'danger'});
        }
      );
    },

    openPage(page) {
      this.page = page;
      this.loadBackupList();
      this.showLoader = true;
      window.editor.open(page, () => {
        this.showLoader = false;
      });
    },

    loadBackupList() {
      axios
        .get("./backups/backups.json")
        .then((res) => {
          this.backupList = res.data.filter((backup) => {
            return (backup.page === this.page);
          });
        });
    },

    restoreBackup(backup) {
      UIkit.modal.
      confirm('Вы действительно хотите восстановится с этой резервной копии?', 
        { labels: { ok: "Восстановить", cancel: "Отмена" } }
      )
      .then(() => {
        this.showLoader = false;
        return axios.post("./api/restoreBackup.php", { "page": this.page, "file": backup.file});
       }).then(() => {
          window.editor.open(this.page, () => {
            this.showLoader = false;
          });
       });
    }
  },
  created() {
    window.editor.open(this.page, () => {
      this.showLoader = false;
    });
    axios
      .get("./api/pageList.php")
      .then((res) => {
        this.pageList = res.data;       
      });
      this.loadBackupList();
  }
});