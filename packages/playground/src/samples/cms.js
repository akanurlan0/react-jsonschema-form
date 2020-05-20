module.exports = {
  schema: {
    title: "CMS Page",
    type: "object",
    properties: {
      block2: {
        type: "object",
        title: "Block with image",
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
          img: {
            type: "string",
            title: "icon card",
            description: "A sample body",
          },
          text: {
            type: "string",
            title: "text",
            description: "id-goes-here",
          },
        },
        required: ["title", "img", "text"],
      },
    },
  },
  uiSchema: {
    block2: {
      "ui:field": "CmsPromo",
    },
  },
  formData: {
    title: "My current tasks",
    block2: {
      title: "Заголовок промо",
      img:
        "https://cdn.pixabay.com/photo/2020/05/13/18/58/nature-5168551_1280.jpg",
      text:
        "JSONSchema is limited for describing how a given data type should be rendered as a form input component. That`s why this lib introduces the concept of UI schema. A UI schema is basically an object literal providing information on how the form should be rendered, while the JSON schema tells what.",
    },
  },
};
