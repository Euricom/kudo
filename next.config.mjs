// @ts-check

// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`;
}

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  transpilePackages: [
    "@adobe/react-spectrum",
    "@react-spectrum/actiongroup",
    "@react-spectrum/avatar",
    "@react-spectrum/badge",
    "@react-spectrum/breadcrumbs",
    "@react-spectrum/button",
    "@react-spectrum/buttongroup",
    "@react-spectrum/calendar",
    "@react-spectrum/color",
    "@react-spectrum/checkbox",
    "@react-spectrum/combobox",
    "@react-spectrum/contextualhelp",
    "@react-spectrum/datepicker",
    "@react-spectrum/dialog",
    "@react-spectrum/divider",
    "@react-spectrum/dnd",
    "@react-spectrum/form",
    "@react-spectrum/icon",
    "@react-spectrum/illustratedmessage",
    "@react-spectrum/image",
    "@react-spectrum/label",
    "@react-spectrum/labeledvalue",
    "@react-spectrum/layout",
    "@react-spectrum/link",
    "@react-spectrum/list",
    "@react-spectrum/listbox",
    "@react-spectrum/menu",
    "@react-spectrum/meter",
    "@react-spectrum/numberfield",
    "@react-spectrum/overlays",
    "@react-spectrum/picker",
    "@react-spectrum/progress",
    "@react-spectrum/provider",
    "@react-spectrum/radio",
    "@react-spectrum/slider",
    "@react-spectrum/searchfield",
    "@react-spectrum/statuslight",
    "@react-spectrum/switch",
    "@react-spectrum/table",
    "@react-spectrum/tabs",
    "@react-spectrum/text",
    "@react-spectrum/textfield",
    "@react-spectrum/theme-dark",
    "@react-spectrum/theme-default",
    "@react-spectrum/theme-light",
    "@react-spectrum/tooltip",
    "@react-spectrum/view",
    "@react-spectrum/well",
    "@spectrum-icons/illustrations",
    "@spectrum-icons/ui",
    "@spectrum-icons/workflow",
  ],
};

export default config;
