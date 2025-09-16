(() => {
  let isFirstTime = true;
  // Change this component at your convenience:
  Vue.component("App", {
    template: $template,
    props: {
      uuid: {
        type: String,
        default: () => {
          return Vue.prototype.$lsw.utils.getRandomString(10);
        }
      }
    },
    data() {
      return {
        isMounted: false,
        selectedPanel: "edicion", // also: "edicion", "visualizacion"
        source: "graph TD;\n\nA --> B;\nB --> C;\nC --> A;",
        compilated: "",
      };
    },
    methods: {
      async selectPanel(panel) {
        this.$trace("App.methods.selectPanel");
        if(panel === "visualizacion") {
          await this.compile();
        }
        this.selectedPanel = panel;
      },
      async compile() {
        this.$trace("App.methods.compile");
        const output = await mermaid.render(LswRandomizer.getRandomString(10), this.source);
        this.$refs.mermaidRenderer.innerHTML = output.svg;
      },
      async visualize() {
        this.$trace("App.methods.visualize");
        return await this.selectPanel("visualizacion");
      },
      exportAsLink() {
        this.$trace("App.methods.exportAsLink");
        console.log("exporting as link");
        const parameters = new URLSearchParams({ source: this.source });
        const url = new URL(window.location.href);
        const productLink = `${url.protocol}//${url.hostname}:${url.port}${url.pathname}?${parameters.toString()}`;
        LswUtils.copyToClipboard(productLink);
        this.$lsw.toasts.send({
          title: "Link exportado al portapapeles",
          text: productLink,
        });
      }
    },
    async mounted() {
      console.log("[💛] Application mounted.");
      await mermaid.mermaidAPI.globalReset();
      this.isMounted = true;
      if (isFirstTime) {
        Vue.prototype.$app = this;
        isFirstTime = false;
        window.dispatchEvent(new CustomEvent("lsw_app_mounted", {
          applicationUuid: this.uuid,
          $lsw: this.$lsw,
          appComponent: this,
        }));
        await LswLifecycle.onApplicationMounted();
        Adjust_text_height: {
          this.$refs.editorDeTexto.style.height = (this.$window.innerHeight - 70) + "px";
        }
        Load_link: {
          const parameters = new URLSearchParams(window.location.search);
          const source = parameters.get("source");
          if(!source) {
            break Load_link;
          }
          this.source = source;
          this.visualize();
        }
      }
    }
  });
})(); 