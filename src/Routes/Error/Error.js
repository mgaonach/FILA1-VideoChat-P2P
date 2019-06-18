import React from 'react';

const errors = {
    "404": 'La page recherchée n\'existe pas ou plus.',
    "520": 'Une erreur inconnue est survenue.'
}

function Error(props) {
    let code = props.code;
    let error = errors[code];
    
    if (error === undefined) {
        code = "520";
        error = errors[code];
    }

    return (
        <div className="d-flex justify-content-center align-items-center h-75">
            <h1 className="mr-3 pr-3 align-top border-right inline-block align-content-center">{code}</h1>
            <div class="inline-block align-middle">
                <h2 class="font-weight-normal lead" id="desc">{error}</h2>
            </div>
        </div>
    );
}

export default Error;