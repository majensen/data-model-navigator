import { MDFReader } from 'mdf-reader';
import axios from 'axios';

export default function loadMDFModel(...urls) {
  let ps = urls.map( (url) => {
    return axios.get(url instanceof Object ? url.format() : url)
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
