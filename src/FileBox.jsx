import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  inputToUrls
} from './getModel';
import { modelRepos, modelFileList } from './repos';
  
export default function UrlBox({
  setFileBoxText,
  setUrls,
  setModel,
}) {
  const [fileList, setFileList] = useState([]);
  const textareaRef = useRef(null);
  
  function handleSelect(e) {
    const hdl = e.target.value;
    setFileList(modelFileList(hdl));
  }
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const jsn = Object.fromEntries(formData.entries());
    setFileBoxText(jsn.urlBoxContent)
    setUrls( inputToUrls(jsn.urlBoxContent) );
    setModel(null); // kick Effect
  }
  const ModelOpts = () => {
    const ret =  Object.keys(modelRepos).toSorted()
      .map( (lbl) => {
        return (
          <option key={lbl} value={lbl}>{lbl}</option>
        );
      } );
    return [ (<option key="dum" value="">Select:</option>), ...ret ];
  };
  useEffect( () => {
    if (fileList) {
      textareaRef.current.value = fileList.join('\n');
    }
  }, [fileList]);
  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Choose a model:
          <select
            name="model"
            onChange={handleSelect}
            style={{ padding:"5px", marginLeft:"10px" }}
          >
            <ModelOpts />
          </select>
          <br />
      </label>
        <label>
          Or enter URLs of a set of MDF files, one per line:
          <br />
          <textarea
            ref={textareaRef}
            name='urlBoxContent'
            rows={4}
            columns={150}
            style={{width: "800px"}}
          />
        </label>
        <br />
        <button
          type="submit"
          style={{ padding:"5px" }}
        >Navigate</button>
        <button
          type="reset"
          style={{ padding:"5px" }}
        >Reset</button>
      </form>
    </>
  );
}
                              
