/** @jsx h */
import deepDiffMapper from "./Diff"

const initDOM = (
  <div>
    <p>Hello!</p>
    <ul>
      <li>How is it going?</li>
    </ul>
  </div>
);

const addNode = (
  <div>
    <p>Hello!</p>
    <ul>
      <li>How is it going?</li>
    </ul>
    <p>Good</p>
  </div>
);

const removeNode = (
  <div>
    <p>Hello!</p>
    <ul>
      <li>How is it going?</li>
    </ul>
  </div>
);

const changeNode = (
  <div>
    <p>Hi!</p>
    <ul>
      <li>How is it going?</li>
    </ul>
  </div>
);

function h(type, props, ...children) {
  return { type, props, children };
}

function createElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  node.children.map(createElement).forEach($el.appendChild.bind($el));
  return $el;
}

const patch = (dom, vdom, parent=dom.parentNode) => {
  const replace = parent ? el => (parent.replaceChild(el, dom) && el) : (el => el);

  if (typeof vdom != 'object' && dom instanceof Text) {
      return dom.textContent != vdom ? replace(render(vdom, parent)) : dom;
  }  else if (typeof vdom == 'object' && dom.nodeName != vdom.type.toUpperCase()) {
      return replace(render(vdom, parent));
  } else if (typeof vdom == 'object' && dom.nodeName == vdom.type.toUpperCase()) {
      const pool = {};
      [].concat(...dom.childNodes).map((child, index) => {
          const key = `__key${index}`;
          pool[key] = child;
      });
      [].concat(...vdom.children).map((child, index) => {
          const key = `__key${index}`;
          dom.appendChild(pool[key] ? patch(pool[key], child) : render(child, dom));
          delete pool[key];
      });
      for (const key in pool) {
          pool[key].remove();
      }
      return dom;
  }
};

const render = (vdom, parent=null) => {
  const mount = parent ? (el => parent.appendChild(el)) : (el => el);
  if (typeof vdom == 'string' || typeof vdom == 'number') {
      return mount(document.createTextNode(vdom));
  } else if (typeof vdom == 'object' && typeof vdom.type == 'string') {
      const dom = mount(document.createElement(vdom.type));
      for (const child of [].concat(...vdom.children))
          render(child, dom);
      return dom;
  } else {
      throw new Error(`Invalid VDOM: ${vdom}.`);
  }
};

function updateElement() {
  // TODO: implement
  //console.log(arguments[1], arguments[2]);
  let dom = arguments[0];
  let newDom = arguments[1];
  patch(dom, newDom);
}


const rootElement = document.getElementById("root");
rootElement.appendChild(createElement(initDOM));



const buttons = document.getElementById("buttons");
const initNodeButton = document.createElement("button");

initNodeButton.innerText = "Init";

buttons.appendChild(initNodeButton);

initNodeButton.addEventListener("click", () => {
  updateElement(rootElement, initDOM, initDOM);
});

const addNodeButton = document.createElement("button");
addNodeButton.innerText = "Add";
buttons.appendChild(addNodeButton);
addNodeButton.addEventListener("click", () => {
  updateElement(rootElement, addNode, initDOM);
});

const removeNodeButton = document.createElement("button");
removeNodeButton.innerText = "Remove";
buttons.appendChild(removeNodeButton);
removeNodeButton.addEventListener("click", () => {
  updateElement(rootElement, removeNode, addNode);
});

const changeNodeButton = document.createElement("button");
changeNodeButton.innerText = "Change";
buttons.appendChild(changeNodeButton);
changeNodeButton.addEventListener("click", () => {
  updateElement(rootElement, changeNode, removeNode);
});






