# Standalone MDF Model Viewer

This package is a completely refactored, standalone version of the Bento
framework "Data Model Navigator" React component.

It is meant to be pointed at any arbitrary graph model specified by a
set of [MDF](https://github.com/CBIIT/bento-mdf) files, to create an
annotated data dictionary with an interactive graphical rendering of
the model.

![screenshot of ICDC model graph](https://github.com/majensen/model-navigator-standalone/blob/main/screen-1.png)

![screenshot of filtered ICDC model graph](https://github.com/majensen/model-navigator-standalone/blob/main/screen-2.png)

![screenshot of searched GDC model graph](https://github.com/majensen/model-navigator-standalone/blob/main/screen-3.png)

![screenshot of CCDI model table](https://github.com/majensen/model-navigator-standalone/blob/main/screen-5.png)

To start it out of the box:

     git clone https://github.com/majensen/model-navigator-standalone
     cd model-navigator-standalone
     npm --legacy-peer-deps install
     npm start

which should open the model viewer onto the
[Integrated Canine Data Commons](https://caninecommons.cancer.gov)
graph data model.

## Usage

Just import the `ModelNavigator` component and the `loadMDF`
utility. Load MDFs to return an
[MDFReader](https://www.npmjs.com/package/mdf-reader) model
object. Provide the model to the navigator component. Render in 
an appropriate element.

```js
import ModelNavigator, { loadMDF } from  './components/ModelNavigator';
const mdf_urls = ['https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model.yml',
                  'https://raw.githubusercontent.com/CBIIT/icdc-model-tool/develop/model-desc/icdc-model-props.yml'];
function getModel() {
  return loadMDF(...mdf_urls)
    .then( (model) => model );
}
const model = await getModel();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ModelNavigator
      model={model}
    />
  </React.StrictMode>
);

```

## Custom Configuration

The Facet Filter and Legend features provide filtering and custom
rendering of model nodes that have been assigned to a given logical
grouping, or "category". Nodes are assigned categories in the model
files themselves, using
[Tags](https://github.com/CBIIT/bento-mdf?tab=readme-ov-file#tagging-entities).
Tag model nodes with the key `Category` and values which name the
desired categories.

The app can be configured to display:

* A custom title,
* A custom brand icon at the top,
* Custom facet sections and facets for filtering, based on additional model Tags,
* Custom graph icons and colors for nodes of different categories,
* Custom category icons for the legend,
* Custom styles for node categories in the Table view.

To do this, provide a config object to the `ModelNavigator` attribute 
`config` having the following keys:

```js
const config = {
  pageTitle,
  brandIconSrc,
  facetSections,
  facetFilters,
  tagAttributes,
  legendTag,
  annotationTags,
};
```

See the file [ICDCconfig.js](https://github.com/majensen/model-navigator-standalone/blob/main/src/ICDCconfig.js)
for examples of the values of these elements.
