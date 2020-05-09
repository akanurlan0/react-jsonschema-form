module.exports = {
  schema: {
    title: "CMS Page",
    type: "object",
    required: ["block1", "block2", "block3", "block4"],
    properties: {
      block1: {
        type: "object",
        title: "Alert",
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
          body: {
            type: "string",
            title: "Body",
            description: "A sample body",
          },
          type: {
            type: "string",
            title: "Alert type",
            description: "An alert type",
            enum: ["alert-danger", "alert-warning", "alert-success"],
          },
        },
        required: ["title", "body", "type"],
      },
      block2: {
        type: "object",
        title: "Block with image",
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
          body: {
            type: "string",
            title: "Body",
            description: "A sample body",
          },
          imageS3Url: {
            type: "string",
            title: "Image S3 URL",
            description: "id-goes-here",
          },
        },
        required: ["title", "body", "imageS3Url"],
      },
      block3: {
        type: "object",
        title: "Paragraph",
        properties: {
          body: {
            type: "string",
            title: "Body",
            description: "A sample body",
          },
        },
        required: ["body"],
      },
      block4: {
        type: "array",
        title: "Appeals",
        items: {
          type: "object",
          required: ["title", "appealId"],
          properties: {
            title: {
              type: "string",
              title: "Title",
              description: "A sample title",
            },
            regionName: {
              type: "string",
              title: "Region",
              description: "A sample region name",
            },
            appealId: {
              type: "string",
              title: "Appeal identifier",
              description: "An appeal identifier",
            },
          },
        },
      },
      block5: {
        type: "object",
        title: "Block with image 2",
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
          body: {
            type: "string",
            title: "Body",
            description: "A sample body",
          },
          imageS3Url: {
            type: "string",
            title: "Image S3 URL",
            description: "id-goes-here",
          },
        },
        required: ["title", "body", "imageS3Url"],
      },
      block6: {
        type: "object",
        title: "Paragraph 2",
        properties: {
          body: {
            type: "string",
            title: "Body",
            description: "A sample body",
          },
        },
        required: ["body"],
      },
      block7: {
        type: "object",
        title: "Alert",
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
          body: {
            type: "string",
            title: "Body",
            description: "A sample body",
          },
          type: {
            type: "string",
            title: "Alert type",
            description: "An alert type",
            enum: ["alert-danger", "alert-warning", "alert-success"],
          },
        },
        required: ["title", "body", "type"],
      },
    },
  },
  uiSchema: {
    block1: {
      "ui:field": "alert",
    },
    block2: {
      "ui:field": "blockWithImage",
    },
    block3: {
      "ui:field": "paragraph",
    },
    block4: {
      "ui:field": "appeals",
    },
    block5: {
      "ui:field": "blockWithImage",
    },
    block6: {
      "ui:field": "paragraph",
    },
    block7: {
      "ui:field": "alert",
    },
  },
  formData: {
    title: "My current tasks",
    block1: {
      title: "Error!",
      body: "Access denied!",
      type: "alert-danger",
    },
    block2: {
      title: "Caution!",
      body: "BE CAREFUL!",
      imageS3Url: "s3-file-id",
    },
    block3: {
      body:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin volutpat nibh eget odio fringilla malesuada sodales eget nisi. Cras volutpat, erat nec ornare consectetur, nunc dui dignissim velit, vel volutpat turpis odio quis nunc. Integer feugiat cursus congue. Sed sodales, purus nec posuere fringilla, justo ligula vestibulum arcu, quis consectetur erat nisl a ipsum. Sed dignissim diam sed lacus malesuada, id porta erat tincidunt. In mi nulla, dignissim eu porttitor vitae, porta nec lacus. Nam augue nulla, tempor hendrerit eros mattis, semper consectetur lectus. Aliquam laoreet mollis nisl in feugiat. Curabitur et erat viverra, faucibus metus ut, ultricies dolor. Morbi felis nisl, dignissim sed nisl eget, vehicula volutpat turpis. Pellentesque sed justo ullamcorper, porttitor urna nec, fermentum turpis. Cras feugiat lectus quis est ultrices, non porttitor ante condimentum. Quisque eleifend urna vel cursus mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    },
    block4: [
      {
        title: "Appeal text 1",
        regionName: "Region 1",
        appealId: "01436636-642a-41a8-b598-63e57680e52d",
      },
      {
        title: "Appeal text 2",
        regionName: "Region 2",
        appealId: "907c9eba-3d34-4557-b2eb-42cff7dd759c",
      },
    ],
    block5: {
      title: "Thanks for attention!",
      body: "",
      imageS3Url: "s3-file-id-2",
    },
    block6: {
      body:
        "Donec nulla odio, rhoncus pulvinar sapien at, venenatis eleifend lectus. Nullam eleifend imperdiet ultrices. Proin accumsan pretium massa, sed dignissim magna. Quisque mi eros, volutpat quis ipsum non, interdum ullamcorper ipsum. Morbi ligula ex, ultricies vitae ultricies eget, venenatis a urna. Suspendisse eget eros eu dui maximus viverra. Quisque diam ipsum, pellentesque in libero vitae, interdum porttitor nulla. Aenean gravida odio at risus suscipit rhoncus. Pellentesque imperdiet nunc ut porta sagittis. Donec id elit id odio gravida gravida in id est. Pellentesque suscipit eleifend nunc, eu euismod est tincidunt id. Nullam egestas consectetur ornare. Mauris pharetra efficitur quam ut aliquet. Pellentesque fermentum pulvinar leo ut interdum. Nullam accumsan consectetur tempus. Ut efficitur, libero et tincidunt porta, nulla nulla sodales tortor, ut convallis sapien libero vitae nibh.",
    },
    block7: {
      title: "Success!",
      body: "Access granted!",
      type: "alert-success",
    },
  },
};
