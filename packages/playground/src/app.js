import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import { samples, globalCMSState } from "./samples";
import "react-app-polyfill/ie11";
import Form, { withTheme } from "@rjsf/core";
import DemoFrame from "./DemoFrame";

// deepEquals and shouldRender and isArguments are copied from rjsf-core. TODO: unify these utility functions.

function isArguments(object) {
  return Object.prototype.toString.call(object) === "[object Arguments]";
}

function deepEquals(a, b, ca = [], cb = []) {
  // Partially extracted from node-deeper and adapted to exclude comparison
  // checks for functions.
  // https://github.com/othiym23/node-deeper
  if (a === b) {
    return true;
  } else if (typeof a === "function" || typeof b === "function") {
    // Assume all functions are equivalent
    // see https://github.com/mozilla-services/react-jsonschema-form/issues/255
    return true;
  } else if (typeof a !== "object" || typeof b !== "object") {
    return false;
  } else if (a === null || b === null) {
    return false;
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (a instanceof RegExp && b instanceof RegExp) {
    return (
      a.source === b.source &&
      a.global === b.global &&
      a.multiline === b.multiline &&
      a.lastIndex === b.lastIndex &&
      a.ignoreCase === b.ignoreCase
    );
  } else if (isArguments(a) || isArguments(b)) {
    if (!(isArguments(a) && isArguments(b))) {
      return false;
    }
    let slice = Array.prototype.slice;
    return deepEquals(slice.call(a), slice.call(b), ca, cb);
  } else {
    if (a.constructor !== b.constructor) {
      return false;
    }

    let ka = Object.keys(a);
    let kb = Object.keys(b);
    // don't bother with stack acrobatics if there's nothing there
    if (ka.length === 0 && kb.length === 0) {
      return true;
    }
    if (ka.length !== kb.length) {
      return false;
    }

    let cal = ca.length;
    while (cal--) {
      if (ca[cal] === a) {
        return cb[cal] === b;
      }
    }
    ca.push(a);
    cb.push(b);

    ka.sort();
    kb.sort();
    for (var j = ka.length - 1; j >= 0; j--) {
      if (ka[j] !== kb[j]) {
        return false;
      }
    }

    let key;
    for (let k = ka.length - 1; k >= 0; k--) {
      key = ka[k];
      if (!deepEquals(a[key], b[key], ca, cb)) {
        return false;
      }
    }

    ca.pop();
    cb.pop();

    return true;
  }
}

function shouldRender(comp, nextProps, nextState) {
  const { props, state } = comp;
  return !deepEquals(props, nextProps) || !deepEquals(state, nextState);
}

const log = type => console.log.bind(console, type);
const toJson = val => JSON.stringify(val, null, 2);
const liveSettingsSchema = {
  type: "object",
  properties: {
    validate: { type: "boolean", title: "Live validation" },
    disable: { type: "boolean", title: "Disable whole form" },
    omitExtraData: { type: "boolean", title: "Omit extra data" },
    liveOmit: { type: "boolean", title: "Live omit" },
  },
};

const monacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
};

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <div className="row">
          <div className="col-sm-6">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange("lat")}
            />
          </div>
          <div className="col-sm-6">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange("lon")}
            />
          </div>
        </div>
      </div>
    );
  }
}

class CMSAlert extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      // this.setState({ [name]: parseFloat(event.target.value) });
      // setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { title, body, type } = this.state;
    return (
      <div className="alert">
        <div className={"alert " + type} role="alert">
          <h4 className="alert-heading">{title}</h4>
          <p>{body}</p>
        </div>
      </div>
    );
  }
}

class CMSBlockWithImage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      // this.setState({ [name]: parseFloat(event.target.value) });
      // setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { title, body, imageS3Url } = this.state;

    // fetch s3 file
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-4">
            <div className="panel panel-default">
              <div className="panel-body">
                Here goes an image from S3: {imageS3Url}
              </div>
            </div>
          </div>
          <div className="col-xs-8">
            <h4>{title}</h4>
            <p>{body}</p>
          </div>
        </div>
      </div>
    );
  }
}

class CMSParagraph extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      // this.setState({ [name]: parseFloat(event.target.value) });
      // setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { body } = this.state;
    return <p>{body}</p>;
  }
}

class CMSAppeals extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      // this.setState({ [name]: parseFloat(event.target.value) });
      // setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const state = this.state;

    return (
      <ul>
        {Object.keys(state).map((key, item) => {
          <li>
            <ul>
              <li>{state[key].regionName}</li>
              <li>{state[key].title}</li>
              <li>
                <a href="#">Посмотреть</a>
              </li>
            </ul>
          </li>;
        })}
      </ul>
    );
  }
}

class CMSPromo extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { title, img, text } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="col-xs-6">
            <img src={img} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }
}

class CMSPromoEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: event.target.value });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { title, img, text } = this.state;
    return (
      <div>
        <h3>Promo:</h3>
        <div className="row">
          <div className="col-xs-12">
            <label>Заголовок</label>
            <input
              className="form-control"
              type="text"
              value={title}
              onChange={this.onChange("title")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <label>Изображение</label>
            <input
              className="form-control"
              type="text"
              value={img}
              onChange={this.onChange("img")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <label>Текст</label>
            <textarea
              rows="5"
              className="form-control"
              value={text}
              onChange={this.onChange("text")}
            />
          </div>
        </div>
      </div>
    );
  }
}

class CMSConstructor extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    console.log(globalCMSState);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  addPromo() {
    var newJsonSchema = Object.assign({}, globalCMSState.jsonSchema);
    var newUiSchema = Object.assign({}, globalCMSState.uiSchema);
    var newFormData = Object.assign({}, globalCMSState.formData);

    var promoSchema = {
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
    };

    var promoUiSchema = {
      "ui:field": "CmsPromo",
    };

    var promoFormData = {
      title: "Заголовок промо",
      img:
        "https://cdn.pixabay.com/photo/2020/05/13/18/58/nature-5168551_1280.jpg",
      text:
        "JSONSchema is limited for describing how a given data type should be rendered as a form input component. That`s why this lib introduces the concept of UI schema. A UI schema is basically an object literal providing information on how the form should be rendered, while the JSON schema tells what.",
    };

    newJsonSchema.properties[
      "block" + globalCMSState.blockCounter
    ] = promoSchema;
    newUiSchema["block" + globalCMSState.blockCounter] = promoUiSchema;
    newFormData["block" + globalCMSState.blockCounter] = promoFormData;

    globalCMSState.playground.onSchemaEdited(newJsonSchema);
    globalCMSState.playground.onFormDataEdited(newFormData);
    globalCMSState.playground.onUISchemaEdited(newUiSchema);

    globalCMSState.blockCounter++;
  }

  redraw() {
    var newJsonSchema = Object.assign({}, globalCMSState.jsonSchema);
    var newUiSchema = Object.assign({}, globalCMSState.uiSchema);
    var newFormData = Object.assign({}, globalCMSState.formData);

    var prefix = globalCMSState.previewMode ? "Editor" : "";

    for (const [key, value] of Object.entries(newUiSchema)) {
      console.log(key);
      if (value["ui:field"]) {
        if (value["ui:field"].startsWith("CmsPromo")) {
          value["ui:field"] = "CmsPromo" + prefix;
        }
      }
    }

    newJsonSchema.title = "Hello " + globalCMSState.resetCounter;
    globalCMSState.resetCounter++;

    globalCMSState.playground.onSchemaEdited(newJsonSchema);
    globalCMSState.playground.onFormDataEdited(newFormData);
    globalCMSState.playground.onUISchemaEdited(newUiSchema);
  }

  switchPreview() {
    globalCMSState.previewMode = !globalCMSState.previewMode;
    this.redraw();
  }

  addPromoEditor(e) {
    var newJsonSchema = Object.assign({}, globalCMSState.jsonSchema);
    var newUiSchema = Object.assign({}, globalCMSState.uiSchema);
    var newFormData = Object.assign({}, globalCMSState.formData);

    var promoSchema = {
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
    };

    var promoUiSchema = {
      "ui:field": "CmsPromoEditor",
    };

    var promoFormData = {
      title: "Заголовок промо",
      img:
        "https://cdn.pixabay.com/photo/2020/05/13/18/58/nature-5168551_1280.jpg",
      text:
        "JSONSchema is limited for describing how a given data type should be rendered as a form input component. That`s why this lib introduces the concept of UI schema. A UI schema is basically an object literal providing information on how the form should be rendered, while the JSON schema tells what.",
    };

    newJsonSchema.properties[
      "block" + globalCMSState.blockCounter
    ] = promoSchema;
    newUiSchema["block" + globalCMSState.blockCounter] = promoUiSchema;
    newFormData["block" + globalCMSState.blockCounter] = promoFormData;

    globalCMSState.playground.onSchemaEdited(newJsonSchema);
    globalCMSState.playground.onFormDataEdited(newFormData);
    globalCMSState.playground.onUISchemaEdited(newUiSchema);

    globalCMSState.blockCounter++;
  }

  render() {
    return (
      <div>
        {/* <input type="button" onClick={this.addPromo} value="Add promo viewer" /> */}
        <input
          type="button"
          onClick={this.addPromoEditor.bind(this)}
          value="Add promo editor"
        />
        <input
          type="button"
          onClick={this.switchPreview.bind(this)}
          value="Switch preview"
        />
      </div>
    );
  }
}

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.valid) {
      return (
        JSON.stringify(JSON.parse(nextProps.code)) !==
        JSON.stringify(JSON.parse(this.state.code))
      );
    }
    return false;
  }

  onCodeChange = code => {
    try {
      const parsedCode = JSON.parse(code);
      this.setState({ valid: true, code }, () =>
        this.props.onChange(parsedCode)
      );
    } catch (err) {
      this.setState({ valid: false, code });
    }
  };

  render() {
    const { title } = this.props;
    const icon = this.state.valid ? "ok" : "remove";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className={`${cls} glyphicon glyphicon-${icon}`} />
          {" " + title}
        </div>
        <MonacoEditor
          language="json"
          value={this.state.code}
          theme="vs-light"
          onChange={this.onCodeChange}
          height={400}
          options={monacoEditorOptions}
        />
      </div>
    );
  }
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <ul className="nav nav-pills">
        {Object.keys(samples).map((label, i) => {
          return (
            <li
              key={i}
              role="presentation"
              className={this.state.current === label ? "active" : ""}>
              <a href="#" onClick={this.onLabelClick(label)}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

function ThemeSelector({ theme, themes, select }) {
  const schema = {
    type: "string",
    enum: Object.keys(themes),
  };
  const uiSchema = {
    "ui:placeholder": "Select theme",
  };
  return (
    <Form
      className="form_rjsf_themeSelector"
      idPrefix="rjsf_themeSelector"
      schema={schema}
      uiSchema={uiSchema}
      formData={theme}
      onChange={({ formData }) =>
        formData && select(formData, themes[formData])
      }>
      <div />
    </Form>
  );
}

function SubthemeSelector({ subtheme, subthemes, select }) {
  const schema = {
    type: "string",
    enum: Object.keys(subthemes),
  };
  const uiSchema = {
    "ui:placeholder": "Select subtheme",
  };
  return (
    <Form
      className="form_rjsf_subthemeSelector"
      idPrefix="rjsf_subthemeSelector"
      schema={schema}
      uiSchema={uiSchema}
      formData={subtheme}
      onChange={({ formData }) =>
        formData && select(formData, subthemes[formData])
      }>
      <div />
    </Form>
  );
}

class CopyLink extends Component {
  onCopyClick = event => {
    this.input.select();
    document.execCommand("copy");
  };

  render() {
    const { shareURL, onShare } = this.props;
    if (!shareURL) {
      return (
        <button className="btn btn-default" type="button" onClick={onShare}>
          Share
        </button>
      );
    }
    return (
      <div className="input-group">
        <input
          type="text"
          ref={input => (this.input = input)}
          className="form-control"
          defaultValue={shareURL}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-default"
            type="button"
            onClick={this.onCopyClick}>
            <i className="glyphicon glyphicon-copy" />
          </button>
        </span>
      </div>
    );
  }
}

class Playground extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, validate } = samples.Simple;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      theme: "default",
      subtheme: null,
      liveSettings: {
        validate: true,
        disable: false,
        omitExtraData: false,
        liveOmit: false,
      },
      shareURL: null,
      FormComponent: withTheme({}),
    };
    globalCMSState.playground = this;
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load({ theme: Object.keys(this.props.themes)[0] });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate, ObjectFieldTemplate, extraErrors } = data;
    // uiSchema is missing on some examples. Provide a default to
    // clear the field in all cases.
    const { uiSchema = {} } = data;

    const { theme = this.state.theme } = data;
    const { themes } = this.props;
    this.onThemeSelected(theme, themes[theme]);

    // force resetting form component instance
    this.setState({ form: false }, () => {
      this.setState({
        ...data,
        form: true,
        ArrayFieldTemplate,
        ObjectFieldTemplate,
        uiSchema,
        extraErrors,
      });
    });
  };

  onSchemaEdited = schema => this.setState({ schema, shareURL: null });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  onExtraErrorsEdited = extraErrors =>
    this.setState({ extraErrors, shareURL: null });

  onThemeSelected = (
    theme,
    { subthemes, stylesheet, theme: themeObj } = {}
  ) => {
    this.setState({
      theme,
      subthemes,
      subtheme: null,
      FormComponent: withTheme(themeObj),
      stylesheet,
    });
  };

  onSubthemeSelected = (subtheme, { stylesheet }) => {
    this.setState({
      subtheme,
      stylesheet,
    });
  };

  setLiveSettings = ({ formData }) => this.setState({ liveSettings: formData });

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  onShare = () => {
    const {
      formData,
      schema,
      uiSchema,
      liveSettings,
      errorSchema,
      theme,
    } = this.state;
    const {
      location: { origin, pathname },
    } = document;
    try {
      const hash = btoa(
        JSON.stringify({
          formData,
          schema,
          uiSchema,
          theme,
          liveSettings,
          errorSchema,
        })
      );
      this.setState({ shareURL: `${origin}${pathname}#${hash}` });
    } catch (err) {
      this.setState({ shareURL: null });
    }
  };

  render() {
    const {
      schema,
      uiSchema,
      formData,
      extraErrors,
      liveSettings,
      validate,
      theme,
      subtheme,
      FormComponent,
      ArrayFieldTemplate,
      ObjectFieldTemplate,
      transformErrors,
    } = this.state;

    const { themes } = this.props;

    let templateProps = {};
    if (ArrayFieldTemplate) {
      templateProps.ArrayFieldTemplate = ArrayFieldTemplate;
    }
    if (ObjectFieldTemplate) {
      templateProps.ObjectFieldTemplate = ObjectFieldTemplate;
    }
    if (extraErrors) {
      templateProps.extraErrors = extraErrors;
    }

    globalCMSState.jsonSchema = schema;
    globalCMSState.uiSchema = uiSchema;
    globalCMSState.formData = formData;

    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>react-jsonschema-form</h1>
          <div className="row">
            <div className="col-sm-8">
              <Selector onSelected={this.load} />
            </div>
            <div className="col-sm-2">
              <Form
                idPrefix="rjsf_options"
                schema={liveSettingsSchema}
                formData={liveSettings}
                onChange={this.setLiveSettings}>
                <div />
              </Form>
            </div>
            <div className="col-sm-2">
              <ThemeSelector
                themes={themes}
                theme={theme}
                select={this.onThemeSelected}
              />
              {themes[theme].subthemes && (
                <SubthemeSelector
                  subthemes={themes[theme].subthemes}
                  subtheme={subtheme}
                  select={this.onSubthemeSelected}
                />
              )}
              <CopyLink shareURL={this.state.shareURL} onShare={this.onShare} />
            </div>
          </div>
        </div>
        <div className="col-sm-7">
          <Editor
            title="JSONSchema"
            code={toJson(schema)}
            onChange={this.onSchemaEdited}
          />
          <div className="row">
            <div className="col-sm-6">
              <Editor
                title="UISchema"
                code={toJson(uiSchema)}
                onChange={this.onUISchemaEdited}
              />
            </div>
            <div className="col-sm-6">
              <Editor
                title="formData"
                code={toJson(formData)}
                onChange={this.onFormDataEdited}
              />
            </div>
          </div>
          {extraErrors && (
            <div className="row">
              <div className="col">
                <Editor
                  title="extraErrors"
                  code={toJson(extraErrors || {})}
                  onChange={this.onExtraErrorsEdited}
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-sm-5">
          {this.state.form && (
            <DemoFrame
              head={
                <link
                  rel="stylesheet"
                  id="theme"
                  href={this.state.stylesheet || ""}
                />
              }
              style={{
                width: "100%",
                height: 1000,
                border: 0,
              }}
              theme={theme}>
              <FormComponent
                {...templateProps}
                liveValidate={liveSettings.validate}
                disabled={liveSettings.disable}
                omitExtraData={liveSettings.omitExtraData}
                liveOmit={liveSettings.liveOmit}
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={this.onFormDataChange}
                onSubmit={({ formData }, e) => {
                  console.log("submitted formData", formData);
                  console.log("submit event", e);
                }}
                fields={{
                  geo: GeoPosition,
                  alert: CMSAlert,
                  blockWithImage: CMSBlockWithImage,
                  paragraph: CMSParagraph,
                  appeals: CMSAppeals,
                  CmsPromo: CMSPromo,
                  CmsPromoEditor: CMSPromoEditor,
                  CmsConstructor: CMSConstructor,
                }}
                validate={validate}
                onBlur={(id, value) =>
                  console.log(`Touched ${id} with value ${value}`)
                }
                onFocus={(id, value) =>
                  console.log(`Focused ${id} with value ${value}`)
                }
                transformErrors={transformErrors}
                onError={log("errors")}
              />
            </DemoFrame>
          )}
        </div>
        <div className="col-sm-12">
          <p style={{ textAlign: "center" }}>
            Powered by{" "}
            <a href="https://github.com/mozilla-services/react-jsonschema-form">
              react-jsonschema-form
            </a>
            .
            {process.env.SHOW_NETLIFY_BADGE === "true" && (
              <div style={{ float: "right" }}>
                <a href="https://www.netlify.com">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" />
                </a>
              </div>
            )}
          </p>
        </div>
      </div>
    );
  }
}

export default Playground;
