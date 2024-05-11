import { MDFReader } from 'mdf-reader';
import axios from 'axios';

// add inclusion and uiDisplay tags to properties:
MDFReader.add_parse_hook(
  function () {
    const translate = { "Yes":"required", "No":"optional", "Preferred":"preferred" };
    this.props().
      forEach( (prop) => {
        let val = translate[prop.is_required] || "optional";
        this.updateTags("inclusion", val, prop);
        val = prop.tags().filter( (t) => t[0] == 'Labeled' ).length > 0 ? "yes" : "no";
        this.updateTags("uiDisplay", val, prop);
      });
    return this;
  }
);

export default function loadMDFDictionary(...urls) {
  let ps = urls.map( (url) => {
    return axios.get(url)
      .then( (r) => { return r.data; } );
  });

  let p = Promise.all(ps)
      .then( (results) => {
        let dta = [];
        results.forEach( (result) => {
          dta.push(result);
        });
        return dta;
      })
      .then( (dta) =>
        { return new MDFReader(...dta); }
      )
      .catch( (e) => { throw new Error(e); } );
  return p;
}
