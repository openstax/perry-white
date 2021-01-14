
[![NPM](https://img.shields.io/npm/v/perry-white.svg)](https://www.npmjs.com/package/perry-white)
[![Actions Status](https://github.com/openstax/perry-white/workflows/CI%20checks/badge.svg)](https://github.com/openstax/perry-white/actions)

# Perry White

<p align="center">
  <strong>WYSIWYG editor based on ProseMirror & React</strong>  <i>Perry White</i> was the newspaper editor for Clark Kent in SuperMan.
</p>
<p align="center">
  Includes significant text markup including size, face, color, line spacing, strikethrough, bold, italic, etc.; multi-level bullet/number lists; images with text wrapping and resizing; and a powerful table (with images and markup within table)
</p>


## History

Perry White is based on several projects.

* The base editor is [ProseMirror](https://prosemirror.net).
* [CZI-Prosemirror](https://github.com/chanzuckerberg/czi-prosemirror) built on top of that and added React rendering
* That was extended further by the [Licit Editor](https://github.com/MO-Movia/licit)
* This fork converts from flow to Typescript, adds a few plugins and removes several that were not wanted

### [DEMO](https://openstax.github.io/perry-white/?pg=405335a3-7cff-4df2-a9ad-29062a4af261@8.14:95497188-90c9-4aff-9446-222d4d6f9743@9)


## Development

* `yarn start` will fire up webpack and serve the demo page for adhoc testing
  * The test page then then be viewed at http://localhost:3008/
* `yarn build:release` will compile for distribution
* To test the build files you can manually copy them to a project via:
  * rsync -rR {dist,scss} <path to project>/node_modules/perry-white/
