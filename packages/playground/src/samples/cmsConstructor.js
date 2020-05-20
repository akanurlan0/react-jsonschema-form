module.exports = {
  schema: {
    title: "CMS Page",
    type: "object",
    properties: {
      cmsConstructor: {
        type: "object",
        title: "Constructor",
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
        },
      },
    },
  },
  uiSchema: {
    cmsConstructor: {
      "ui:field": "CmsConstructor",
    },
  },
  formData: {
    title: "My current tasks",
    cmsConstructor: {
      title: "Hello",
    },
  },
};
