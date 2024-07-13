import React from 'react';
import { nanoid } from 'nanoid';
import { StrictMode, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ModelNavigator from './components/ModelNavigator';
import './index.css';
import {
  loadMDFModel,
} from './getModel';
import UrlBox from './FileBox';

const root = ReactDOM.createRoot(document.getElementById('root'));

// feedback on urls detected
const URLS = ({urls}) => {
  if (!urls || urls.length === 0) {
    return (
      <>
      </>
    );
  }
  const lis = urls.map( u => ( <li key={u.format()}>{u.format()}</li> ) );
  return (
    <ul>{lis}</ul>
  );
}

// feedback that model succesfully loaded
const Model = ({model}) => {
  if (model) {
    const nd = model ? model.nodes() : [];
    const nodes = nd
          .map( n => {
            return ( <li key={n.handle}>{n.handle}</li> )
          })
    return (
      <div>
        Model: { model.handle ? model.handle : "not set" }
        <br />
        Nodes:
        <br />
        <ul>
          {nodes}
        </ul>
      </div>
    );
  } else {
    return (
      <>
      </>
    );
  }
}

const Page = () => {
  const [fileBoxText, setFileBoxText] = useState("What?");
  const [model, setModel] = useState(null);
  const [urls, setUrls] = useState([]);
  useEffect( () => {
    let ignore = false;
    if (urls && urls.length >0) {
      loadMDFModel(...urls).then(
        (m) => {
          if (!ignore) {
            m.id = nanoid();
            setModel(m);
          }
        });
      return () => { ignore = true; };
    }
  },[urls, model]);
  return (
    <>
      <UrlBox
        setFileBoxText={setFileBoxText}
        setUrls={setUrls}
        setModel={setModel}
      />
      <div style={{color: "blue"}}>
        <URLS
          urls={urls}
        />
      </div>
      {/* <Model model={model} /> */}
      { model && (
        <ModelNavigator
          model={model}
        />
      )}
    </>
  )
}

root.render(
  <StrictMode>
    <div>
      <Page/>
    </div>
  </StrictMode>
);

