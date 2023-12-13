import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


document.addEventListener('DOMContentLoaded', function() {
  function renderApp() {
    var root = document.getElementById('root');
    ReactDOM.createRoot(root).render(
      React.createElement(React.StrictMode, null, React.createElement(App))
    );
  }

  // Check if the root element exists
  if (document.getElementById('root')) {
    renderApp();
  } else {
    // If the root element is not found, wait for it to appear
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          for (var i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].id === 'root') {
              observer.disconnect();
              renderApp();
              break;
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
});

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
