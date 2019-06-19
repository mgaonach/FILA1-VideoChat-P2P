import React, { createContext, Component } from 'react';

export const NotificationContext = createContext({
    notificationMessage: '',
    notificationVariant: 'primary',
    pushNotification: () => {},
    clearNotification: () => {}
});

class NotificationProvider extends Component {
    state = {
        notificationMessage: '',
        notificationVariant: 'primary',
        pushNotification: (notificationMessage, notificationVariant) => {
            const newState = {};

            if ( notificationMessage == null || notificationMessage === '' ) {
                return; // Pas de notification si pas de notificationMessage
            } 

            newState.notificationMessage = notificationMessage
            if ( this.isValidVariant(notificationVariant) ) {
                newState.notificationVariant = notificationVariant;
            }

            this.setState(
                newState
            );

            setTimeout(this.clearNotification, 5000);
        }
    }

    clearNotification = () => {
        this.setState({
            notificationMessage: '',
            notificationVariant: 'primary'
        })
    }

    isValidVariant = (notificationVariant) => {
        const notificationVariants = [
            'primary',
            'secondary',
            'success',
            'danger',
            'warning',
            'info',
            'light',
            'dark',
          ];

        if ( notificationVariant == null || notificationVariant === '' ) {
            return false;
        }

        for(let i = 0, len = notificationVariants.length; i < len; i++){
            if ( notificationVariant === notificationVariants[i] ) {
                return true;
            }
        }
    
        return false;
    }

    render() {
        return (
            <NotificationContext.Provider value={this.state}>
                {this.props.children}
            </NotificationContext.Provider>
        );
    }
}

/**
 * Transforme un composant en NotificationContext.Consumer
 * @param {*} Component Le composant qui utilisera ce contexte
 * @return le composant après ajout du contenu contexte dans la liste de ses props
 */
export const withNotification = Component => props => (
    <NotificationContext.Consumer>
        {notification => <Component {...props} {...notification} />}
    </NotificationContext.Consumer>
);

export default NotificationProvider;
