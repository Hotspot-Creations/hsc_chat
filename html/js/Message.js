Vue.component("message", {
  template: "#message_template",

  computed: {
    textEscaped() {
      const templates = this.templates || {};
      const args = Array.isArray(this.args) ? this.args : [];

      let activeTemplateId =
        this.templateId || CONFIG.defaultTemplateId;

      let selectedTemplate =
        typeof this.template === "string" && this.template.length > 0
          ? this.template
          : null;

      /*
       * Use the alternate template when the default template receives
       * only one argument.
       */
      if (
        !selectedTemplate &&
        activeTemplateId === CONFIG.defaultTemplateId &&
        args.length === 1
      ) {
        activeTemplateId = CONFIG.defaultAltTemplateId;
      }

      /*
       * Fall back safely if a script requests a template that does
       * not exist.
       */
      if (!selectedTemplate) {
        selectedTemplate =
          templates[activeTemplateId] ||
          templates[CONFIG.defaultTemplateId] ||
          "{0}";
      }

      selectedTemplate = String(selectedTemplate);

      selectedTemplate = selectedTemplate.replace(
        /{(\d+)}/g,
        (match, number) => {
          const index = Number(number);
          const argument = args[index];

          if (argument === undefined) {
            return match;
          }

          return this.escape(argument);
        },
      );

      return this.colorize(selectedTemplate);
    },
  },

  methods: {
    /**
     * Maintained for compatibility with older resources.
     */
    colorizeOld(value) {
      if (!Array.isArray(this.color) || this.color.length < 3) {
        return String(value);
      }

      const red = Number(this.color[0]) || 255;
      const green = Number(this.color[1]) || 255;
      const blue = Number(this.color[2]) || 255;

      return (
        `<span style="color: rgb(${red}, ${green}, ${blue})">` +
        `${String(value)}</span>`
      );
    },

    colorize(value) {
      const text = String(value);

      let output =
        "<span>" +
        text.replace(
          /\^([0-9])/g,
          (_, color) =>
            `</span><span class="color-${color}">`,
        ) +
        "</span>";

      const allowedStyles = {
        "*": "font-weight: bold;",
        _: "text-decoration: underline;",
        "~": "text-decoration: line-through;",
        "=": "text-decoration: underline line-through;",
        r: "text-decoration: none; font-weight: normal;",
      };

      const styleRegex =
        /\^([_*~=r])(.*?)(?=$|\^r|<\/em>)/;

      /*
       * The safety counter prevents malformed formatting codes from
       * creating an endless replacement loop.
       */
      let safetyCounter = 0;

      while (styleRegex.test(output) && safetyCounter < 100) {
        output = output.replace(
          styleRegex,
          (_, style, inner) =>
            `<em style="${allowedStyles[style]}">${inner}</em>`,
        );

        safetyCounter += 1;
      }

      return output.replace(
        /<span[^>]*><\/span>/g,
        "",
      );
    },

    escape(unsafeValue) {
      return String(unsafeValue)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
  },

  props: {
    templates: {
      type: Object,
      default: () => ({}),
    },

    args: {
      type: Array,
      default: () => [],
    },

    template: {
      type: String,
      default: null,
    },

    templateId: {
      type: [String, Number],
      default: CONFIG.defaultTemplateId,
    },

    multiline: {
      type: Boolean,
      default: false,
    },

    // Deprecated, retained for older chat resources.
    color: {
      type: Array,
      default: null,
    },
  },
});