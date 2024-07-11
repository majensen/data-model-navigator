import url from 'url';
import axios from 'axios';
import { MDFReader } from 'mdf-reader';

export function inputToUrls(text) {
  if (!text || text.length === 0) {
    return;
  }
  let urls = [];
  const lines = text.split('\n');
  lines.forEach( (line) => {
    const u = url.parse(line);
    if ( u.protocol && u.protocol.match(/^https?/) && u.host && u.pathname ) {
      urls.push(u);
    }
  });
  return urls;
}

export function loadMDFModel(...urls) {
  let ps = urls.map( (u) => {
    return axios.get(u instanceof url.Url ? u.format() : u)
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
