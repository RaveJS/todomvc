# rave-text-byext

Adds text file loading to rave.js based on file extensions.

By default, rave-text-byext loads text when it detects the following file
extensions:

`text` `html` `txt` `htm`

You can change this list by adding a `textByext` property to the context.
In HTML, this can be done by placing a `data-text-byext` attribute on the
`<html>` element.  The value of this element should be a comma-separated
list of extensions.

```html
<html data-text-byext="html,css">
```

When running `rave()` as a module, the `textByext` property may also be
an array of extensions or an object whose keys are file extensions.

```js
context.textByext = ['less', 'template'];
```
