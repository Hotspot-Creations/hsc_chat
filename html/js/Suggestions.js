Vue.component("suggestions", {
  template: "#suggestions_template",

  props: {
    message: {
      type: String,
      default: "",
    },

    suggestions: {
      type: Array,
      default: () => [],
    },

    selectedSuggestionIdx: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    currentSuggestions() {
      const currentMessage = this.message.trimStart();

      if (currentMessage === "") {
        return [];
      }

      const limit =
        Number(CONFIG.suggestionLimit) > 0
          ? Number(CONFIG.suggestionLimit)
          : 5;

      return this.suggestions
        .filter((suggestion) =>
          this.matchesSuggestion(suggestion, currentMessage),
        )
        .slice(0, limit)
        .map((suggestion) =>
          this.prepareSuggestion(suggestion, currentMessage),
        );
    },
  },

  methods: {
    matchesSuggestion(suggestion, currentMessage) {
      if (
        !suggestion ||
        typeof suggestion.name !== "string"
      ) {
        return false;
      }

      const suggestionName =
        suggestion.name.trim().toLowerCase();

      const message = currentMessage.toLowerCase();

      if (suggestionName === "") {
        return false;
      }

      /*
       * Match while typing the command:
       *   /rep
       *   /report
       *
       * Continue matching while entering parameters:
       *   /report 12
       *   /report 12 reason
       */
      return (
        suggestionName.startsWith(message) ||
        message.startsWith(`${suggestionName} `)
      );
    },

    prepareSuggestion(suggestion, currentMessage) {
      const name = String(suggestion.name || "");
      const params = this.normalizeParams(suggestion.params);

      const activeParameterIndex =
        this.getActiveParameterIndex(
          currentMessage,
          name,
          params.length,
        );

      return {
        ...suggestion,
        name,

        /*
         * The command name becomes visually disabled after the
         * player begins entering parameters.
         */
        disabled: !name
          .toLowerCase()
          .startsWith(currentMessage.toLowerCase()),

        params: params.map((param, index) => ({
          ...param,
          disabled: index !== activeParameterIndex,
        })),
      };
    },

    normalizeParams(params) {
      if (Array.isArray(params)) {
        return params.map((param, index) => {
          if (param && typeof param === "object") {
            return { ...param };
          }

          return {
            name: String(param || `parameter${index + 1}`),
            help: "",
          };
        });
      }

      if (params && typeof params === "object") {
        return Object.values(params).map((param, index) => {
          if (param && typeof param === "object") {
            return { ...param };
          }

          return {
            name: String(param || `parameter${index + 1}`),
            help: "",
          };
        });
      }

      return [];
    },

    getActiveParameterIndex(
      currentMessage,
      suggestionName,
      parameterCount,
    ) {
      if (parameterCount === 0) {
        return -1;
      }

      const messageLower = currentMessage.toLowerCase();
      const suggestionLower = suggestionName.toLowerCase();

      if (!messageLower.startsWith(suggestionLower)) {
        return -1;
      }

      const remainder = currentMessage.slice(
        suggestionName.length,
      );

      /*
       * Parameters have not started until a space appears after
       * the command name.
       */
      if (!remainder.startsWith(" ")) {
        return -1;
      }

      const parameterText = remainder.slice(1);

      if (parameterText === "") {
        return 0;
      }

      const endsWithSpace = /\s$/.test(parameterText);
      const completedText = parameterText.trim();

      if (completedText === "") {
        return 0;
      }

      const enteredValues =
        completedText.split(/\s+/).length;

      const activeIndex = endsWithSpace
        ? enteredValues
        : enteredValues - 1;

      return Math.min(
        Math.max(activeIndex, 0),
        parameterCount - 1,
      );
    },
  },
});