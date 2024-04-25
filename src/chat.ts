import Handlebars from "handlebars";

export const chatRegisterHelper = () => {
  Handlebars.registerHelper(
    "chat",
    (...children) =>
      new Handlebars.SafeString(`
  <ul class="chat">
    ${
      children.length > 0 ? children.slice(0, children.length - 1).join("") : ""
    }
  </ul>
  `),
  );

  Handlebars.registerHelper(
    "chat-header",
    (title) =>
      new Handlebars.SafeString(`
  <li class="chat-header">
    <div>${title}</div>
  </li>
  `),
  );

  Handlebars.registerHelper(
    "chat-left",
    (message, name, className, faceiconPath) =>
      new Handlebars.SafeString(`
  <li class="chat-left">
    <div class="chat-faceicon">
      <img src="../images/${faceiconPath}" />
      <span class="chat-faceicon-name">${name}</span>
    </div>
    <div class="chat-contents">
      <div class="${className}">
        <div class="trianle-left"></div>
        <div class="balloon-contents">${message}</div>
      </div>
    </div>
  </li>
  `),
  );

  Handlebars.registerHelper(
    "chat-right",
    (message, name, className, faceiconPath) =>
      new Handlebars.SafeString(`
  <li class="chat-right">
    <div class="chat-contents">
      <div class="${className}">
        <div class="trianle-right"></div>
        <div class="balloon-contents">${message}</div>
      </div>
    </div>
    <div class="chat-faceicon">
      <img src="../images/${faceiconPath}" />
      <span class="chat-faceicon-name">${name}</span>
    </div>
  </li>
  `),
  );

  Handlebars.registerHelper(
    "repeat-chat-right",
    (message, className) =>
      new Handlebars.SafeString(`
  <li class="chat-right-invisible">
    <div class="chat-contents">
      <div class="${className}">
      <div class="trianle-right"></div>
      <div class="balloon-contents">${message}</div>
    </div>
    </div>
    <div class="chat-faceicon">
      <img />
      <span class="chat-faceicon-name"></span>
    </div>
  </li>
  `),
  );

  Handlebars.registerHelper(
    "repeat-chat-left",
    (message, className) =>
      new Handlebars.SafeString(`
  <li class="chat-left-invisible">
    <div class="chat-faceicon">
      <img />
      <span class="chat-faceicon-name"></span>
    </div>
    <div class="chat-contents">
      <div class="${className}">
        <div class="trianle-left"></div>
        <div class="balloon-contents">${
          message.startsWith("http")
            ? `<a href="${message}" class="${className}" target="_blank">${message}</a>`
            : message
        }</div>
      </div>
    </div>
  </li>
  `),
  );
};
