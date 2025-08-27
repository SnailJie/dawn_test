import type { VatPluginOptions } from "./index";
import path from "path";

const IFRAME_BRIDGE_VERSION = "1.0.2";
const VAT_CHAT_AGENT_VERSION = "1.0.5";

export default {
  sourceDebug: {
    enabled: true,
    devOnly: true,
    attributeName: "data-source",
    exclude: [/node_modules/],
  },
  viteConfig: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../src"),
      },
    },
    build: {
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  },
  dev: {
    viteConfig: {
      server: {
        host: true,
        port: 8081,
        allowedHosts: true,
      },
    },
  },
  html: {
    cdn: {
      js: [
        {
          src: `https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_iframe-bridge/${IFRAME_BRIDGE_VERSION}/dist/iframe-bridge.min.js`,
        },
      ],
      css: [
        {
          href: `https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_vat-chat-agent/${VAT_CHAT_AGENT_VERSION}/dist/vat-chat-agent.min.css`,
        },
      ],
    },
    inlineScripts: [
      {
        content: `
window.ANTAICODE_HOST = '{ANTAICODE_HOST}';
window.XTC_CONVERSATION_ID = '{XTC_CONVERSATION_ID}';
window.XTC_ENV = '{XTC_ENV}';
        `,
        type: "module",
      },
      {
        content: `
{
  "imports": {
    "react": "https://esm.sh/react@19",
    "react-dom": "https://esm.sh/react-dom@19",
    "react-dom/client": "https://esm.sh/react-dom@19/client"
  }
}
      `,
        type: "importmap",
      },
      {
        content: `
        import React from 'react';
      import * as ReactDOM from 'react-dom';
      import * as ReactDOMClient from 'react-dom/client';
      
      window.React = React;
      window.ReactDOM = { ...ReactDOM, ...ReactDOMClient };
      
      // 动态加载vat-chat-agent确保React已准备好
      const script = document.createElement('script');
      script.src = 'https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_vat-chat-agent/${VAT_CHAT_AGENT_VERSION}/dist/vat-chat-agent.min.js';
      document.head.appendChild(script);
        `,
        type: "module",
      },

      {
        content: `
let childBridge = null;

document.addEventListener('DOMContentLoaded', () => {
  initializeChildBridge();
});

async function initializeChildBridge() {
  try {
    const { ChildBridge } = window.IframeBridge || {};
    if (!ChildBridge) {
      return;
    }

    childBridge = new ChildBridge({
      debug: true,
      highlightColor: '#1890ff',
      highlightStyle: {
        borderColor: '#1890ff',
        borderWidth: 2,
        borderStyle: 'solid',
        backgroundColor: '#1890ff',
        backgroundOpacity: 0.1,
        showLabel: true,
        labelBackgroundColor: '#1890ff',
        labelTextColor: '#ffffff'
      },
      hoverThrottleMs: 100,
      autoInit: true
    });
  } catch (error) {
    console.error(error);
  }
}
        `,
      },
    ],
  },
} as VatPluginOptions;
