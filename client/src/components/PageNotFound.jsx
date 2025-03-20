import React from 'react';
import './styles/PageNotFound.css';

const PageNotFound = () => {
    return (
        <div className="not-found-page">
            <h1>404 Not Found</h1>
            <p>Ne pare rău, pagina pe care o cauți nu a fost găsită.</p>
            <p><a href="/">Înapoi la pagina principală</a></p>
        </div>
    );
};

export default PageNotFound;