
const axios = require("axios");

const DOMHelper = require("./dom-helper");
const EditorText = require("./editorText");
const EditorMeta = require("./editor-meta");
require("./iframe-load");

module.exports = class Editor {
  constructor () {
    this.iframe = document.querySelector("iframe");
  }
  open(page, cb) {
    this.currenrPage = page;
    axios
      .get("../" + page + "?rnd=" + Math.random())
      .then((res) => DOMHelper.parseStrToDom(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then((dom) => {
        this.virtualDom = dom;
        return dom;
      })
      .then(DOMHelper.serializeDomToStr)
      .then((html) => axios.post('./api/saveTempPage.php', { html }))
      .then(() => this.iframe.load("../temp_dgerg35434gf34g3.html"))
      .then((html) => axios.post('./api/deleteTempPage.php'))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(cb);
  }

  enableEditing() {
    this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach((el) => {
      const id = el.getAttribute("nodeid");
      const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);
      new EditorText(el, virtualElement);
    });
    this.metaEditor = new EditorMeta(this.virtualDom);
  }

  injectStyles() { 
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
      text-editor:hover {
        outline: 3px solid orange;
        outline-offset: 8px;
      }
      text-editor:focus {
        outline: 3px solid red;
        outline-offset: 8px;
      }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }



  save(onSucces, onError) {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToStr(newDom);
    axios
      .post("./api/savePage.php", { pageName: this.currenrPage, html })
      .then(onSucces)
      .catch(onError);
  }

};